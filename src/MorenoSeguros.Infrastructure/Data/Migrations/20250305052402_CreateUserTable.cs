using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MorenoSeguros.Infrastructure.Data.Migrations;

/// <inheritdoc />
public partial class CreateUserTable : Migration
{
  /// <inheritdoc />
  protected override void Up(MigrationBuilder migrationBuilder)
  {
    migrationBuilder.AlterColumn<int>(
        name: "Status",
        table: "Contributors",
        type: "integer",
        nullable: false,
        oldClrType: typeof(int),
        oldType: "INTEGER");

    migrationBuilder.AlterColumn<string>(
        name: "PhoneNumber_Number",
        table: "Contributors",
        type: "text",
        nullable: true,
        oldClrType: typeof(string),
        oldType: "TEXT",
        oldNullable: true);

    migrationBuilder.AlterColumn<string>(
        name: "PhoneNumber_Extension",
        table: "Contributors",
        type: "text",
        nullable: true,
        oldClrType: typeof(string),
        oldType: "TEXT",
        oldNullable: true);

    migrationBuilder.AlterColumn<string>(
        name: "PhoneNumber_CountryCode",
        table: "Contributors",
        type: "text",
        nullable: true,
        oldClrType: typeof(string),
        oldType: "TEXT",
        oldNullable: true);

    migrationBuilder.AlterColumn<string>(
        name: "Name",
        table: "Contributors",
        type: "character varying(100)",
        maxLength: 100,
        nullable: false,
        oldClrType: typeof(string),
        oldType: "TEXT",
        oldMaxLength: 100);

    migrationBuilder.AlterColumn<int>(
        name: "Id",
        table: "Contributors",
        type: "integer",
        nullable: false,
        oldClrType: typeof(int),
        oldType: "INTEGER")
        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

    migrationBuilder.CreateTable(
        name: "Users",
        columns: table => new
        {
          Id = table.Column<int>(type: "integer", nullable: false)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
          FirstName = table.Column<string>(type: "text", nullable: false),
          LastName = table.Column<string>(type: "text", nullable: false),
          Ci = table.Column<string>(type: "text", nullable: false),
          PhoneNumber = table.Column<string>(type: "text", nullable: false),
          Username = table.Column<string>(type: "text", nullable: true),
          Email = table.Column<string>(type: "text", nullable: false),
          Password = table.Column<string>(type: "text", nullable: false),
          Role = table.Column<string>(type: "text", nullable: false),
          IsActive = table.Column<bool>(type: "boolean", nullable: false),
          CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
          UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Users", x => x.Id);
        });
  }

  /// <inheritdoc />
  protected override void Down(MigrationBuilder migrationBuilder)
  {
    migrationBuilder.DropTable(
        name: "Users");

    migrationBuilder.AlterColumn<int>(
        name: "Status",
        table: "Contributors",
        type: "INTEGER",
        nullable: false,
        oldClrType: typeof(int),
        oldType: "integer");

    migrationBuilder.AlterColumn<string>(
        name: "PhoneNumber_Number",
        table: "Contributors",
        type: "TEXT",
        nullable: true,
        oldClrType: typeof(string),
        oldType: "text",
        oldNullable: true);

    migrationBuilder.AlterColumn<string>(
        name: "PhoneNumber_Extension",
        table: "Contributors",
        type: "TEXT",
        nullable: true,
        oldClrType: typeof(string),
        oldType: "text",
        oldNullable: true);

    migrationBuilder.AlterColumn<string>(
        name: "PhoneNumber_CountryCode",
        table: "Contributors",
        type: "TEXT",
        nullable: true,
        oldClrType: typeof(string),
        oldType: "text",
        oldNullable: true);

    migrationBuilder.AlterColumn<string>(
        name: "Name",
        table: "Contributors",
        type: "TEXT",
        maxLength: 100,
        nullable: false,
        oldClrType: typeof(string),
        oldType: "character varying(100)",
        oldMaxLength: 100);

    migrationBuilder.AlterColumn<int>(
        name: "Id",
        table: "Contributors",
        type: "INTEGER",
        nullable: false,
        oldClrType: typeof(int),
        oldType: "integer")
        .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);
  }
}
