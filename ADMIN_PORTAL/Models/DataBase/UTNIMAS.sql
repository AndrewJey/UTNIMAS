USE [master]
GO
/****** Object:  Database [UTNIMAS]    Script Date: 28/09/2019 06:09:52 ******/
CREATE DATABASE [UTNIMAS]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'UTNIMAS', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\UTNIMAS.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'UTNIMAS_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\UTNIMAS_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [UTNIMAS] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [UTNIMAS].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [UTNIMAS] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [UTNIMAS] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [UTNIMAS] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [UTNIMAS] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [UTNIMAS] SET ARITHABORT OFF 
GO
ALTER DATABASE [UTNIMAS] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [UTNIMAS] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [UTNIMAS] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [UTNIMAS] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [UTNIMAS] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [UTNIMAS] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [UTNIMAS] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [UTNIMAS] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [UTNIMAS] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [UTNIMAS] SET  DISABLE_BROKER 
GO
ALTER DATABASE [UTNIMAS] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [UTNIMAS] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [UTNIMAS] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [UTNIMAS] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [UTNIMAS] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [UTNIMAS] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [UTNIMAS] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [UTNIMAS] SET RECOVERY FULL 
GO
ALTER DATABASE [UTNIMAS] SET  MULTI_USER 
GO
ALTER DATABASE [UTNIMAS] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [UTNIMAS] SET DB_CHAINING OFF 
GO
ALTER DATABASE [UTNIMAS] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [UTNIMAS] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [UTNIMAS] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'UTNIMAS', N'ON'
GO
ALTER DATABASE [UTNIMAS] SET QUERY_STORE = OFF
GO
USE [UTNIMAS]
GO
ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO
USE [UTNIMAS]
GO
/****** Object:  Table [dbo].[CLIENTS]    Script Date: 28/09/2019 06:09:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CLIENTS](
	[ID_CLIENT] [int] NOT NULL IDENTITY(1,1),
	[NOMBRE1_CLIENT] [varchar](max) NOT NULL,
	[NOMBRE2_CLIENT] [varchar](max) NULL,
	[APELLIDO1_CLIENT] [varchar](max) NOT NULL,
	[APELLIDO2_CLIENT] [varchar](max) NULL,
	[DIRECCION1_CLIENT] [varchar](max) NOT NULL,
	[CIUDAD_CLIENT] [varchar](max) NOT NULL,
	[DISTRITO_CLIENT] [varchar](max) NULL,
	[CANTON_CLIENT] [varchar](max) NOT NULL,
	[PROVINCIA_CLIENT] [varchar](max) NOT NULL,
	[TELEF_CASA_CLIENT] [varchar](max) NULL,
	[TELF_CELULAR_CLIENT] [varchar](max) NOT NULL,
	[EMAIL_CLIENT] [varchar](max) NULL,
 CONSTRAINT [PK_CLIENTS] PRIMARY KEY CLUSTERED 
(
	[ID_CLIENT] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EMPRESAS]    Script Date: 28/09/2019 06:09:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EMPRESAS](
	[EMPRESA_ID] [int] NOT NULL IDENTITY(1,1),
	[NOMBRE_EMPRESA] [varchar](max) NOT NULL,
	[DIRECCION_EMPRESA] [varchar](max) NOT NULL,
	[NOMBRE_CONTACTO] [varchar](max) NOT NULL,
	[TELEF_CONTACTO] [varchar](max) NOT NULL,
	[EMAIL_EMPRESA] [varchar](max) NOT NULL,
	[SECTOR_PRODUCCION] [varchar](max) NOT NULL,
	[ID_CLIENTE] [int] NULL,
 CONSTRAINT [PK_EMPRESAS] PRIMARY KEY CLUSTERED 
(
	[EMPRESA_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PRECIOS]    Script Date: 28/09/2019 06:09:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PRECIOS](
	[PRECIOS_ID] [int] NOT NULL IDENTITY(1,1),
	[PRECIO_UNIDAD] [float] NOT NULL,
	[PRECIO_PAQUETE] [float] NULL,
	[PRECIO_SERVICIO] [float] NULL,
	[PRECIO_MAYOREO] [float] NULL,
	[PRECIO_ESPECIAL] [float] NULL,
 CONSTRAINT [PK_PRECIOS] PRIMARY KEY CLUSTERED 
(
	[PRECIOS_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PRODUCTS]    Script Date: 28/09/2019 06:09:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PRODUCTS](
	[PRODUCTO_ID] [int] NOT NULL IDENTITY(1,1),
	[NOMBRE_PRODUCTO] [varchar](max) NOT NULL,
	[ID_PRECIO] [int] NULL,
	[DESCRIP_PRODUCTO] [varchar](max) NOT NULL,
	[FOTO_PRODUCTO] [image] NULL,
	[EMPRESA_ID] [int] NOT NULL,
 CONSTRAINT [PK_PRODUCTS] PRIMARY KEY CLUSTERED 
(
	[PRODUCTO_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[USERS]    Script Date: 28/09/2019 06:09:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[USERS](
	[USER_ID] [int] NOT NULL IDENTITY(1,1),
	[USER_NAME] [varchar](max) NOT NULL,
	[USER_EMAIL] [varchar](max) NOT NULL,
	[USER_PASSWORD] [varchar](max) NOT NULL,
 CONSTRAINT [PK_USERS] PRIMARY KEY CLUSTERED 
(
	[USER_ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[EMPRESAS]  WITH CHECK ADD  CONSTRAINT [ID_CLIENT] FOREIGN KEY([ID_CLIENTE])
REFERENCES [dbo].[CLIENTS] ([ID_CLIENT])
GO
ALTER TABLE [dbo].[EMPRESAS] CHECK CONSTRAINT [ID_CLIENT]
GO
ALTER TABLE [dbo].[PRODUCTS]  WITH CHECK ADD  CONSTRAINT [EMPRESA_ID] FOREIGN KEY([EMPRESA_ID])
REFERENCES [dbo].[EMPRESAS] ([EMPRESA_ID])
GO
ALTER TABLE [dbo].[PRODUCTS] CHECK CONSTRAINT [EMPRESA_ID]
GO
--ALTER TABLE [dbo].[PRODUCTS]  WITH CHECK ADD  CONSTRAINT [PRECIOS_ID] FOREIGN KEY([ID_PRECIO])
--REFERENCES [dbo].[PRECIOS] ([PRECIOS_ID])
--GO
ALTER TABLE [dbo].[PRODUCTS] CHECK CONSTRAINT [PRECIOS_ID]
GO
USE [master]
GO
ALTER DATABASE [UTNIMAS] SET  READ_WRITE 
GO
