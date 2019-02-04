using Microsoft.EntityFrameworkCore.Migrations;

namespace jnccwebapi.Migrations
{
    public partial class ModifyIndexesAndLayers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MapInstance_Name",
                table: "MapInstance");

            migrationBuilder.DropIndex(
                name: "IX_BaseLayer_Name",
                table: "BaseLayer");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Layer",
                newName: "StyleName");

            migrationBuilder.AddColumn<long>(
                name: "Order",
                table: "LayerGroup",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "DownloadURL",
                table: "Layer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LayerName",
                table: "Layer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetadataDescription",
                table: "Layer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MapInstance_Name",
                table: "MapInstance",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_BaseLayer_Name",
                table: "BaseLayer",
                column: "Name",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MapInstance_Name",
                table: "MapInstance");

            migrationBuilder.DropIndex(
                name: "IX_BaseLayer_Name",
                table: "BaseLayer");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "LayerGroup");

            migrationBuilder.DropColumn(
                name: "DownloadURL",
                table: "Layer");

            migrationBuilder.DropColumn(
                name: "LayerName",
                table: "Layer");

            migrationBuilder.DropColumn(
                name: "MetadataDescription",
                table: "Layer");

            migrationBuilder.RenameColumn(
                name: "StyleName",
                table: "Layer",
                newName: "Description");

            migrationBuilder.CreateIndex(
                name: "IX_MapInstance_Name",
                table: "MapInstance",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_BaseLayer_Name",
                table: "BaseLayer",
                column: "Name");
        }
    }
}
