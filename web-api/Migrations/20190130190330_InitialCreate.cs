using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace jnccwebapi.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BaseLayer",
                columns: table => new
                {
                    BaseLayerId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    MetadataUrl = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true),
                    Visible = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BaseLayer", x => x.BaseLayerId);
                });

            migrationBuilder.CreateTable(
                name: "Lookup",
                columns: table => new
                {
                    LookupId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Code = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    LookupCategory = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lookup", x => x.LookupId);
                });

            migrationBuilder.CreateTable(
                name: "MapInstance",
                columns: table => new
                {
                    MapInstanceId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Centre = table.Column<string>(nullable: true),
                    Zoom = table.Column<int>(nullable: false),
                    BaseLayerList = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapInstance", x => x.MapInstanceId);
                });

            migrationBuilder.CreateTable(
                name: "LayerGroup",
                columns: table => new
                {
                    LayerGroupId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    MapInstanceId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LayerGroup", x => x.LayerGroupId);
                    table.ForeignKey(
                        name: "FK_LayerGroup_MapInstance_MapInstanceId",
                        column: x => x.MapInstanceId,
                        principalTable: "MapInstance",
                        principalColumn: "MapInstanceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Layer",
                columns: table => new
                {
                    LayerId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    MetadataUrl = table.Column<string>(nullable: true),
                    SubLayerGroup = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true),
                    Order = table.Column<long>(nullable: false),
                    Visible = table.Column<bool>(nullable: false),
                    Opacity = table.Column<float>(nullable: false),
                    LayerGroupId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Layer", x => x.LayerId);
                    table.ForeignKey(
                        name: "FK_Layer_LayerGroup_LayerGroupId",
                        column: x => x.LayerGroupId,
                        principalTable: "LayerGroup",
                        principalColumn: "LayerGroupId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Filter",
                columns: table => new
                {
                    FilterId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    MetadataUrl = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Attribute = table.Column<string>(nullable: true),
                    LookupCategory = table.Column<string>(nullable: true),
                    LayerId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Filter", x => x.FilterId);
                    table.ForeignKey(
                        name: "FK_Filter_Layer_LayerId",
                        column: x => x.LayerId,
                        principalTable: "Layer",
                        principalColumn: "LayerId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Filter_LayerId",
                table: "Filter",
                column: "LayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Layer_LayerGroupId",
                table: "Layer",
                column: "LayerGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_LayerGroup_MapInstanceId",
                table: "LayerGroup",
                column: "MapInstanceId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BaseLayer");

            migrationBuilder.DropTable(
                name: "Filter");

            migrationBuilder.DropTable(
                name: "Lookup");

            migrationBuilder.DropTable(
                name: "Layer");

            migrationBuilder.DropTable(
                name: "LayerGroup");

            migrationBuilder.DropTable(
                name: "MapInstance");
        }
    }
}
