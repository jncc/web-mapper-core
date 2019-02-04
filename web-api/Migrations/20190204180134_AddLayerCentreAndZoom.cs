using Microsoft.EntityFrameworkCore.Migrations;

namespace jnccwebapi.Migrations
{
    public partial class AddLayerCentreAndZoom : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Centre",
                table: "Layer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Zoom",
                table: "Layer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Centre",
                table: "Layer");

            migrationBuilder.DropColumn(
                name: "Zoom",
                table: "Layer");
        }
    }
}
