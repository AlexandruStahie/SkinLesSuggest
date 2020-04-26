using Microsoft.EntityFrameworkCore.Migrations;

namespace SkinLesSuggest.Migrations
{
    public partial class user_changes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_UserDetails_UserDetailsId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_UserDetailsId",
                table: "Users");

            migrationBuilder.AddForeignKey(
                name: "FK_UserDetails_Users_Id",
                table: "UserDetails",
                column: "Id",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserDetails_Users_Id",
                table: "UserDetails");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserDetailsId",
                table: "Users",
                column: "UserDetailsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_UserDetails_UserDetailsId",
                table: "Users",
                column: "UserDetailsId",
                principalTable: "UserDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
