using Microsoft.EntityFrameworkCore.Migrations;

namespace jnccwebapi.Migrations
{
    public partial class Indexes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_MapInstance_Name",
                table: "MapInstance",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Lookup_LookupCategory",
                table: "Lookup",
                column: "LookupCategory");

            migrationBuilder.CreateIndex(
                name: "IX_LayerGroup_Name",
                table: "LayerGroup",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Layer_Name",
                table: "Layer",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Filter_Name",
                table: "Filter",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_BaseLayer_Name",
                table: "BaseLayer",
                column: "Name");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MapInstance_Name",
                table: "MapInstance");

            migrationBuilder.DropIndex(
                name: "IX_Lookup_LookupCategory",
                table: "Lookup");

            migrationBuilder.DropIndex(
                name: "IX_LayerGroup_Name",
                table: "LayerGroup");

            migrationBuilder.DropIndex(
                name: "IX_Layer_Name",
                table: "Layer");

            migrationBuilder.DropIndex(
                name: "IX_Filter_Name",
                table: "Filter");

            migrationBuilder.DropIndex(
                name: "IX_BaseLayer_Name",
                table: "BaseLayer");
        }
    }
}
