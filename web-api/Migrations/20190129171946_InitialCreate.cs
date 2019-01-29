using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace jnccwebapi.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MapInstances",
                columns: table => new
                {
                    MapId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapInstances", x => x.MapId);
                });

            migrationBuilder.CreateTable(
                name: "LayerGroups",
                columns: table => new
                {
                    LayerGroupId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    MapInstanceMapId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LayerGroups", x => x.LayerGroupId);
                    table.ForeignKey(
                        name: "FK_LayerGroups_MapInstances_MapInstanceMapId",
                        column: x => x.MapInstanceMapId,
                        principalTable: "MapInstances",
                        principalColumn: "MapId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Layers",
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
                    LayerGroupId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Layers", x => x.LayerId);
                    table.ForeignKey(
                        name: "FK_Layers_LayerGroups_LayerGroupId",
                        column: x => x.LayerGroupId,
                        principalTable: "LayerGroups",
                        principalColumn: "LayerGroupId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Filters",
                columns: table => new
                {
                    FilterId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Property = table.Column<string>(nullable: true),
                    LookupSrc = table.Column<string>(nullable: true),
                    LayerId = table.Column<long>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Filters", x => x.FilterId);
                    table.ForeignKey(
                        name: "FK_Filters_Layers_LayerId",
                        column: x => x.LayerId,
                        principalTable: "Layers",
                        principalColumn: "LayerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Filters_LayerId",
                table: "Filters",
                column: "LayerId");

            migrationBuilder.CreateIndex(
                name: "IX_LayerGroups_MapInstanceMapId",
                table: "LayerGroups",
                column: "MapInstanceMapId");

            migrationBuilder.CreateIndex(
                name: "IX_Layers_LayerGroupId",
                table: "Layers",
                column: "LayerGroupId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Filters");

            migrationBuilder.DropTable(
                name: "Layers");

            migrationBuilder.DropTable(
                name: "LayerGroups");

            migrationBuilder.DropTable(
                name: "MapInstances");
        }
    }
}
