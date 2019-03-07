using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace jnccwebapi.Migrations
{
    public partial class ExternalWmsAndLayers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsExternal",
                table: "LayerGroup",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "ExternalWms",
                columns: table => new
                {
                    ExternalWmsId = table.Column<long>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Name = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true),
                    MapInstanceId = table.Column<long>(nullable: false)
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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExternalWms");

            migrationBuilder.DropColumn(
                name: "IsExternal",
                table: "LayerGroup");
        }
    }
}
