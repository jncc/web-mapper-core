using Microsoft.EntityFrameworkCore.Migrations;

namespace jnccwebapi.Migrations
{
    public partial class LegendLayerName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LegendLayerName",
                table: "Layer",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LegendLayerName",
                table: "Layer");
        }
    }
}
