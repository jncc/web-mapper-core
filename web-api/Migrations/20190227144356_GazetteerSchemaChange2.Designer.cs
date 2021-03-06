﻿// <auto-generated />
using MapConfig.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace jnccwebapi.Migrations
{
    [DbContext(typeof(MapConfigContext))]
    [Migration("20190227144356_GazetteerSchemaChange2")]
    partial class GazetteerSchemaChange2
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.2.1-servicing-10028")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("MapConfig.Models.BaseLayer", b =>
                {
                    b.Property<long>("BaseLayerId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("MetadataUrl");

                    b.Property<string>("Name");

                    b.Property<string>("Type");

                    b.Property<string>("Url");

                    b.HasKey("BaseLayerId");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("BaseLayer");
                });

            modelBuilder.Entity("MapConfig.Models.Filter", b =>
                {
                    b.Property<long>("FilterId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Attribute");

                    b.Property<string>("Description");

                    b.Property<bool>("IsComplex");

                    b.Property<long>("LayerId");

                    b.Property<string>("LookupCategory");

                    b.Property<string>("MetadataUrl");

                    b.Property<string>("Name");

                    b.Property<string>("Type");

                    b.HasKey("FilterId");

                    b.HasIndex("LayerId");

                    b.HasIndex("Name");

                    b.ToTable("Filter");
                });

            modelBuilder.Entity("MapConfig.Models.Gazetteer", b =>
                {
                    b.Property<long>("GazetteerId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Category");

                    b.Property<bool>("Imported");

                    b.Property<string>("Name");

                    b.Property<double>("Xmax");

                    b.Property<double>("Xmin");

                    b.Property<double>("Ymax");

                    b.Property<double>("Ymin");

                    b.HasKey("GazetteerId");

                    b.HasIndex("Name");

                    b.ToTable("Gazetteer");
                });

            modelBuilder.Entity("MapConfig.Models.Layer", b =>
                {
                    b.Property<long>("LayerId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("DownloadURL");

                    b.Property<string>("LayerCentre");

                    b.Property<long>("LayerGroupId");

                    b.Property<string>("LayerName");

                    b.Property<float>("LayerOpacity");

                    b.Property<long>("LayerOrder");

                    b.Property<bool>("LayerVisible");

                    b.Property<int>("LayerZoom");

                    b.Property<string>("LegendLayerName");

                    b.Property<string>("MetadataDescription");

                    b.Property<string>("MetadataUrl");

                    b.Property<string>("Name");

                    b.Property<string>("StyleName");

                    b.Property<string>("SubLayerGroup");

                    b.Property<string>("Type");

                    b.Property<string>("Url");

                    b.HasKey("LayerId");

                    b.HasIndex("LayerGroupId");

                    b.HasIndex("Name");

                    b.ToTable("Layer");
                });

            modelBuilder.Entity("MapConfig.Models.LayerGroup", b =>
                {
                    b.Property<long>("LayerGroupId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.Property<long>("MapInstanceId");

                    b.Property<string>("Name");

                    b.Property<long>("Order");

                    b.HasKey("LayerGroupId");

                    b.HasIndex("MapInstanceId");

                    b.HasIndex("Name");

                    b.ToTable("LayerGroup");
                });

            modelBuilder.Entity("MapConfig.Models.Lookup", b =>
                {
                    b.Property<long>("LookupId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Code");

                    b.Property<string>("LookupCategory");

                    b.Property<string>("Name");

                    b.HasKey("LookupId");

                    b.HasIndex("LookupCategory");

                    b.ToTable("Lookup");
                });

            modelBuilder.Entity("MapConfig.Models.MapInstance", b =>
                {
                    b.Property<long>("MapInstanceId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("BaseLayerList");

                    b.Property<string>("Description");

                    b.Property<string>("MapCentre");

                    b.Property<int>("MapZoom");

                    b.Property<string>("Name");

                    b.Property<string>("VisibleBaseLayer");

                    b.HasKey("MapInstanceId");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("MapInstance");
                });

            modelBuilder.Entity("MapConfig.Models.Filter", b =>
                {
                    b.HasOne("MapConfig.Models.Layer", "Layer")
                        .WithMany("Filters")
                        .HasForeignKey("LayerId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MapConfig.Models.Layer", b =>
                {
                    b.HasOne("MapConfig.Models.LayerGroup", "LayerGroup")
                        .WithMany("Layers")
                        .HasForeignKey("LayerGroupId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("MapConfig.Models.LayerGroup", b =>
                {
                    b.HasOne("MapConfig.Models.MapInstance", "Map")
                        .WithMany("LayerGroups")
                        .HasForeignKey("MapInstanceId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
