using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MorenoSeguros.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Add_description_in_Company_table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "InsuranceCompany",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "InsuranceCompany");
        }
    }
}
