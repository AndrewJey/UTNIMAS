using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace ADMIN_PORTAL.Models
{
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
            try
            {
                if (conectarBD != null && conectarBD.State != ConnectionState.Open)
                {
                    conectarBD.Open();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al abrir la BD: " + e.Message);
            }
        }

        public void cerrar()
        {
            try
            {
                if (conectarBD != null && conectarBD.State != ConnectionState.Closed)
                {
                    conectarBD.Close();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al cerrar la BD: " + e.Message);
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
