using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace jnccwebapi.Migrations
{
    public partial class ExternalWmsUrl : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExternalWms");

            migrationBuilder.CreateTable(
                name: "ExternalWmsUrl",
                columns: table => new
                {
                    ExternalWmsUrlId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true),
                    MapInstanceId = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExternalWmsUrl", x => x.ExternalWmsUrlId);
                    table.ForeignKey(
                        name: "FK_ExternalWmsUrl_MapInstance_MapInstanceId",
                        column: x => x.MapInstanceId,
                        principalTable: "MapInstance",
                        principalColumn: "MapInstanceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExternalWmsUrl_MapInstanceId",
                table: "ExternalWmsUrl",
                column: "MapInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_ExternalWmsUrl_Name",
                table: "ExternalWmsUrl",
                column: "Name");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExternalWmsUrl");

            migrationBuilder.CreateTable(
                name: "ExternalWms",
                columns: table => new
                {
                    ExternalWmsId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Description = table.Column<string>(nullable: true),
                    MapInstanceId = table.Column<long>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExternalWms", x => x.ExternalWmsId);
                    table.ForeignKey(
                        name: "FK_ExternalWms_MapInstance_MapInstanceId",
                        column: x => x.MapInstanceId,
                        principalTable: "MapInstance",
                        principalColumn: "MapInstanceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExternalWms_MapInstanceId",
                table: "ExternalWms",
                column: "MapInstanceId");

            migrationBuilder.CreateIndex(
                name: "IX_ExternalWms_Name",
                table: "ExternalWms",
                column: "Name");
        }
    }
}
