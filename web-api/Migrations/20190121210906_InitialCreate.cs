using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace JNCCMapConfigEditor.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LayerItem",
                columns: table => new
                {
                    LayerId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    ReleaseDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LayerItem", x => x.LayerId);
                });

            migrationBuilder.CreateTable(
                name: "MapItem",
                columns: table => new
                {
                    MapId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    ReleaseDate = table.Column<DateTime>(nullable: false),
                    UpdatedDate = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapItem", x => x.MapId);
                });

            migrationBuilder.CreateTable(
                name: "LayerConfigItem",
                columns: table => new
                {
                    LayerConfigId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Value = table.Column<string>(nullable: true),
                    Comment = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: false),
                    LayerId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LayerConfigItem", x => x.LayerConfigId);
                    table.ForeignKey(
                        name: "FK_LayerConfigItem_LayerItem_LayerId",
                        column: x => x.LayerId,
                        principalTable: "LayerItem",
                        principalColumn: "LayerId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MapConfigItem",
                columns: table => new
                {
                    MapConfigId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Value = table.Column<string>(nullable: true),
                    Comment = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: false),
                    MapId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapConfigItem", x => x.MapConfigId);
                    table.ForeignKey(
                        name: "FK_MapConfigItem_MapItem_MapId",
                        column: x => x.MapId,
                        principalTable: "MapItem",
                        principalColumn: "MapId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MapLayerItem",
                columns: table => new
                {
                    MapLayerId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    LayerOrder = table.Column<int>(nullable: false),
                    LayerVisible = table.Column<bool>(nullable: false),
                    Comment = table.Column<string>(nullable: true),
                    UpdatedDate = table.Column<DateTime>(nullable: false),
                    MapId = table.Column<long>(nullable: false),
                    LayerId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapLayerItem", x => x.MapLayerId);
                    table.ForeignKey(
                        name: "FK_MapLayerItem_LayerItem_LayerId",
                        column: x => x.LayerId,
                        principalTable: "LayerItem",
                        principalColumn: "LayerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MapLayerItem_MapItem_MapId",
                        column: x => x.MapId,
                        principalTable: "MapItem",
                        principalColumn: "MapId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LayerConfigItem_LayerId",
                table: "LayerConfigItem",
                column: "LayerId");

            migrationBuilder.CreateIndex(
                name: "IX_MapConfigItem_MapId",
                table: "MapConfigItem",
                column: "MapId");

            migrationBuilder.CreateIndex(
                name: "IX_MapLayerItem_LayerId",
                table: "MapLayerItem",
                column: "LayerId");

            migrationBuilder.CreateIndex(
                name: "IX_MapLayerItem_MapId",
                table: "MapLayerItem",
                column: "MapId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LayerConfigItem");

            migrationBuilder.DropTable(
                name: "MapConfigItem");

            migrationBuilder.DropTable(
                name: "MapLayerItem");

            migrationBuilder.DropTable(
                name: "LayerItem");

            migrationBuilder.DropTable(
                name: "MapItem");
        }
    }
}
