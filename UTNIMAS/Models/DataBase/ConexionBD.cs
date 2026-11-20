using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace UTNIMAS.Models
{
    public class EmpresaContactoInfo
    {
        public string EMPRESA_ID { get; set; }
        public string NOMBRE_EMPRESA { get; set; }
        public string DIRECCION_EMPRESA { get; set; }
        public string NOMBRE_CONTACTO { get; set; }
        public string TELEF_CONTACTO { get; set; }
        public string EMAIL_EMPRESA { get; set; }
        public string SECTOR_PRODUCCION { get; set; }
    }

    public static class LocalCatalogFallback
    {
        public static List<ProductosModels> GetSampleProducts()
        {
            return new List<ProductosModels>
            {
                new ProductosModels
                {
                    PRODUCTOS_ID = 1,
                    NOMBRE_PRODUCTO = "Café Artesanal Monte Verde 500g",
                    ID_PRECIO = 4500,
                    DESCRIP_PRODUCTO = "Tueste medio de altura cultivado por familias emprendedoras de Alajuela.",
                    FOTO_PRODUCTO = "/Content/Images/Markets/340436cf-5092-4e1a-aadc-e2e8c3034e85.jpg",
                    EMPRESA_ID = "1"
                },
                new ProductosModels
                {
                    PRODUCTOS_ID = 2,
                    NOMBRE_PRODUCTO = "Canasta Orgánica de Feria Local",
                    ID_PRECIO = 12500,
                    DESCRIP_PRODUCTO = "Frutas, vegetales frescos y miel pura directa de productores regionales.",
                    FOTO_PRODUCTO = "/Content/Images/Markets/Devaraja-Market.jpg",
                    EMPRESA_ID = "2"
                },
                new ProductosModels
                {
                    PRODUCTOS_ID = 3,
                    NOMBRE_PRODUCTO = "Textiles y Bolsos Bordados a Mano",
                    ID_PRECIO = 18000,
                    DESCRIP_PRODUCTO = "Diseños originales en algodón natural confeccionados por taller cooperativo.",
                    FOTO_PRODUCTO = "/Content/Images/Markets/han-market-shops.jpg",
                    EMPRESA_ID = "3"
                },
                new ProductosModels
                {
                    PRODUCTOS_ID = 4,
                    NOMBRE_PRODUCTO = "Artesanía en Madera Sostenible",
                    ID_PRECIO = 22000,
                    DESCRIP_PRODUCTO = "Tablas de servir y decoración tallada con acabados ecológicos.",
                    FOTO_PRODUCTO = "/Content/Images/Markets/pagePropertiesImage.jpg",
                    EMPRESA_ID = "4"
                },
                new ProductosModels
                {
                    PRODUCTOS_ID = 5,
                    NOMBRE_PRODUCTO = "Colección Vintage & Bazar Creativo",
                    ID_PRECIO = 9500,
                    DESCRIP_PRODUCTO = "Piezas restauradas, bisutería y artículos de diseño local.",
                    FOTO_PRODUCTO = "/Content/Images/Markets/Strasse-17-Juni-Flea-Market-3-800x400.jpg",
                    EMPRESA_ID = "5"
                }
            };
        }

        public static List<EmpresaContactoInfo> GetSampleCompanies()
        {
            return new List<EmpresaContactoInfo>
            {
                new EmpresaContactoInfo
                {
                    EMPRESA_ID = "1",
                    NOMBRE_EMPRESA = "Cafetalera Monte Verde S.A.",
                    DIRECCION_EMPRESA = "Alajuela Centro, 200m norte de la UTN",
                    NOMBRE_CONTACTO = "María Fernanda Solís",
                    TELEF_CONTACTO = "+506 8845-1201",
                    EMAIL_EMPRESA = "ventas@monteverdecafe.cr",
                    SECTOR_PRODUCCION = "Alimentación y Bebidas"
                },
                new EmpresaContactoInfo
                {
                    EMPRESA_ID = "2",
                    NOMBRE_EMPRESA = "Feria Verde del Valle",
                    DIRECCION_EMPRESA = "Grecia, Alajuela, Mercado Municipal",
                    NOMBRE_CONTACTO = "Carlos Alberto Rojas",
                    TELEF_CONTACTO = "+506 8712-3402",
                    EMAIL_EMPRESA = "pedidos@feriaverde.cr",
                    SECTOR_PRODUCCION = "Agricultura"
                },
                new EmpresaContactoInfo
                {
                    EMPRESA_ID = "3",
                    NOMBRE_EMPRESA = "Taller Textil Manos Creativas",
                    DIRECCION_EMPRESA = "San Ramón, Alajuela",
                    NOMBRE_CONTACTO = "Laura Vanessa Mora",
                    TELEF_CONTACTO = "+506 8620-7789",
                    EMAIL_EMPRESA = "contacto@manoscreativas.cr",
                    SECTOR_PRODUCCION = "Textiles y Ropa"
                },
                new EmpresaContactoInfo
                {
                    EMPRESA_ID = "4",
                    NOMBRE_EMPRESA = "Ebanistería Raíces Ticas",
                    DIRECCION_EMPRESA = "Sarchí Norte, Alajuela",
                    NOMBRE_CONTACTO = "Diego Andrés Chaves",
                    TELEF_CONTACTO = "+506 8540-9011",
                    EMAIL_EMPRESA = "info@raicesticas.cr",
                    SECTOR_PRODUCCION = "Producción Madera"
                },
                new EmpresaContactoInfo
                {
                    EMPRESA_ID = "5",
                    NOMBRE_EMPRESA = "Bazar Emprende UTN-IMAS",
                    DIRECCION_EMPRESA = "Villa Bonita, Alajuela",
                    NOMBRE_CONTACTO = "Sofía Jiménez",
                    TELEF_CONTACTO = "+506 8990-4455",
                    EMAIL_EMPRESA = "hola@bazaremprende.cr",
                    SECTOR_PRODUCCION = "Comercio"
                }
            };
        }

        public static EmpresaContactoInfo FindCompanyById(string id)
        {
            string key = (id ?? string.Empty).Trim();
            return GetSampleCompanies().FirstOrDefault(c => string.Equals(c.EMPRESA_ID, key, StringComparison.OrdinalIgnoreCase))
                ?? GetSampleCompanies().First();
        }
    }

    public class ConexionBD : IDisposable
    {
        private const string DefaultConnectionString = "Data Source=.\\SQLEXPRESS;Initial Catalog=UTNIMAS;Integrated Security=True;";
        public SqlConnection conectarBD;

        public static string ResolveConnectionString()
        {
            string env = Environment.GetEnvironmentVariable("UTNIMAS_CONNECTION_STRING");
            if (!string.IsNullOrWhiteSpace(env))
            {
                return env.Trim();
            }

            ConnectionStringSettings cfg = ConfigurationManager.ConnectionStrings["UTNIMAS"]
                ?? ConfigurationManager.ConnectionStrings["DefaultConnection"];
            if (cfg != null && !string.IsNullOrWhiteSpace(cfg.ConnectionString))
            {
                return cfg.ConnectionString.Trim();
            }

            return DefaultConnectionString;
        }

        public ConexionBD()
        {
            conectarBD = new SqlConnection(ResolveConnectionString());
        }

        public SqlConnection ConexDB()
        {
            return conectarBD;
        }

        public void abrir()
        {
            if (conectarBD != null && conectarBD.State != ConnectionState.Open)
            {
                conectarBD.Open();
            }
        }

        public void cerrar()
        {
            if (conectarBD != null && conectarBD.State != ConnectionState.Closed)
            {
                conectarBD.Close();
            }
        }

        public void Dispose()
        {
            if (conectarBD != null)
            {
                conectarBD.Dispose();
                conectarBD = null;
            }
        }
    }
}
