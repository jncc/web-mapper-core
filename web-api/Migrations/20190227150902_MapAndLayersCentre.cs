using Microsoft.EntityFrameworkCore.Migrations;

namespace jnccwebapi.Migrations
{
    public partial class MapAndLayersCentre : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MapCentre",
                table: "MapInstance");

            migrationBuilder.DropColumn(
                name: "LayerCentre",
                table: "Layer");

            migrationBuilder.DropColumn(
                name: "StyleName",
                table: "Layer");

            migrationBuilder.AddColumn<double>(
                name: "MapCentreLat",
                table: "MapInstance",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "MapCentreLon",
                table: "MapInstance",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LayerCentreLat",
                table: "Layer",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "LayerCentreLon",
                table: "Layer",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MapCentreLat",
                table: "MapInstance");

            migrationBuilder.DropColumn(
                name: "MapCentreLon",
                table: "MapInstance");

            migrationBuilder.DropColumn(
                name: "LayerCentreLat",
                table: "Layer");

            migrationBuilder.DropColumn(
                name: "LayerCentreLon",
                table: "Layer");

            migrationBuilder.AddColumn<string>(
                name: "MapCentre",
                table: "MapInstance",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LayerCentre",
                table: "Layer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StyleName",
                table: "Layer",
                nullable: true);
        }
    }
}
