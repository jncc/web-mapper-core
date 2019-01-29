using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace jnccwebapi.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MapInstance",
                columns: table => new
                {
                    MapId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapInstance", x => x.MapId);
                });

            migrationBuilder.CreateTable(
                name: "LayerGroup",
                columns: table => new
                {
                    LayerGroupId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    MapId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LayerGroup", x => x.LayerGroupId);
                    table.ForeignKey(
                        name: "FK_LayerGroup_MapInstance_MapId",
                        column: x => x.MapId,
                        principalTable: "MapInstance",
                        principalColumn: "MapId",
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
                    Order = table.Column<long>(nullable: false),
                    Type = table.Column<string>(nullable: true),
                    Src = table.Column<string>(nullable: true),
                    Visible = table.Column<bool>(nullable: false),
                    Opacity = table.Column<byte>(nullable: false),
                    FilterDefinition = table.Column<string>(nullable: true),
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
                    Type = table.Column<string>(nullable: true),
                    Property = table.Column<string>(nullable: true),
                    LookupSrc = table.Column<string>(nullable: true),
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
                name: "IX_LayerGroup_MapId",
                table: "LayerGroup",
                column: "MapId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Filter");

            migrationBuilder.DropTable(
                name: "Layer");

            migrationBuilder.DropTable(
                name: "LayerGroup");

            migrationBuilder.DropTable(
                name: "MapInstance");
        }
    }
}
