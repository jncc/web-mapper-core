using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Xml.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using MapConfig.Models;

namespace MapConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OgcProxyController : Controller
    {
        private readonly MapConfigContext _context;

        public OgcProxyController(MapConfigContext context)
        {
            _context = context;
        }

        // GET: api/ogcproxy/
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            //extract just the query string into a list of items
            var query = Request.QueryString.Value;
            var queryDictionary = QueryHelpers.ParseQuery(query);
            var items = queryDictionary.SelectMany(x => x.Value, (col, value) => new KeyValuePair<string, string>(col.Key, value)).ToList();
            //find the url= parameter which is base64 encoded
            string url = items.Where(x => x.Key == "url").FirstOrDefault().Value;
            string urlToProxy;
            //try and decode it
            try {
                byte[] base64EncodedBytes = Convert.FromBase64String(url);
                urlToProxy = Encoding.UTF8.GetString(base64EncodedBytes);
            } catch {
                urlToProxy = "";
            }
            var fullUri = "";
            var baseUri = "";
            //if we decoded the url we want proxying, then remove that param and build a new param list
            if (urlToProxy.Length > 0) {
                items.RemoveAll(x => x.Key == "url");
                //extract any params the 'to proxy' url may have had
                var uri = new Uri(urlToProxy);
                baseUri = uri.GetComponents(UriComponents.Scheme | UriComponents.Host | UriComponents.Port | UriComponents.Path, UriFormat.UriEscaped);
                queryDictionary = QueryHelpers.ParseQuery(uri.Query);
                var moreitems = queryDictionary.SelectMany(x => x.Value, (col, value) => new KeyValuePair<string, string>(col.Key, value)).ToList();
                //and add them to the original request's params
                items.AddRange(moreitems);
                var qb = new QueryBuilder(items);
                //to build the final uri we must proxy back to the client
                fullUri = baseUri + qb.ToQueryString();
                //now try the request

                HttpClient client = new HttpClient();

                try {
                    var response = await client.GetAsync(fullUri);
                    if (response == null || !response.IsSuccessStatusCode) {
                        return ReturnError();
                    }

                    string contentType = response.Content.Headers.ContentType?.ToString();
                    if (string.IsNullOrEmpty(contentType)) {
                        //access the content-type directly, the Headers.ContentType was not being populated for this (malformed content-type header?) wfs response 
                        //text/xml; subtype=gml/2.1.2
                        //.net core will not less us pass this value through on the response, so just take everything before the first ;
                        contentType = response.Content.Headers.SingleOrDefault(h => h.Key == "Content-Type").Value.Aggregate((i, j) => j).Split(';')[0];
                    }               

                    var fileName = response.Content.Headers.ContentDisposition?.FileName;              

                    if (contentType.Contains("image")) {
                        var imgStream = await response.Content.ReadAsStreamAsync();
                        return new FileStreamResult(imgStream, contentType);

                    } else if (!string.IsNullOrEmpty(fileName) && response.Content.Headers.ContentDisposition?.DispositionType != "inline") {
                        var stream = await response.Content.ReadAsStreamAsync();                                      
                        return new FileStreamResult(stream, contentType) {
                            FileDownloadName = fileName
                        };

                    } else {
                        //assume text
                        var textResponse = await response.Content.ReadAsStringAsync();
                        //if text/xml check to see if the xml has a ServiceExceptionReport element
                        if (contentType.Contains("text/xml") ) {
                            bool hasError = HasServiceException(textResponse);
                            return new ContentResult {
                                ContentType = contentType,
                                Content = textResponse,
                                StatusCode = hasError ? StatusCodes.Status500InternalServerError: StatusCodes.Status200OK
                            };

                        } else {
                            return ReturnError(); 

                        }
                    }
                } catch (Exception ex) {
                    return ReturnError();

                }            
            
            } else {
                return ReturnError();

            }

            ObjectResult ReturnError() {
                return StatusCode(StatusCodes.Status500InternalServerError, "An error has occured processing the OGC request.");
            }

            bool HasServiceException(string responseText) {
                bool hasError = false;          

                //try and load the response into a xdoc and see if there is a service exception
                //
                //<ServiceExceptionReport version="1.2.0" xmlns="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/ogc http://schemas.opengis.net/wfs/1.0.0/OGC-exception.xsd">
                //  <ServiceException code="InvalidParameterValue" locator="namespace">
                //      Unknown namespace [SHINE_test]
                //</ServiceException>
                //</ServiceExceptionReport>
                try {
                    string xml = null;
                    XDocument doc = default(XDocument);
                    string msg = null;

                    xml = responseText;

                    if ((xml.StartsWith("<?xml version="))) {
                        doc = XDocument.Parse(xml);
                        XNamespace ns = "http://www.opengis.net/ogc";
                        msg = doc.Descendants(ns + "ServiceException").FirstOrDefault().Value;

                        if (!string.IsNullOrEmpty(msg)) {                      
                            hasError = true;
                        }
                    }

                } catch {
                    //catch any xml conversion errors and ignore                
                }
                return hasError;
            }

        }

    }
}