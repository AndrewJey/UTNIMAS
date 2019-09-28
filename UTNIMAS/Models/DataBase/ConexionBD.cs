using System;
using System.Data.SqlClient;
//Conexión a la Base de Datos
namespace UTNIMAS
{
    public class ConexionBD
    {
        string conexion = "Data Source=DESKTOP-E38KCH7;Initial Catalog=UTNIMAS;Integrated Security=True";
        public SqlConnection conectarBD = new SqlConnection();
        //Constructor:
        public ConexionBD()
        {
            conectarBD.ConnectionString = conexion;
        }
        //Abrir la Conexión de la DB:
        public void abrir()
        {
            try
            {
                conectarBD.Open();
                Console.WriteLine("Conexión Abierta");
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Abrir la BD: " + e.Message);
            }
        }
        //Cerrar la Conexión de la DB:
        public void cerrar()
        {
            try
            {
                conectarBD.Close();
                Console.WriteLine("Conexión Cerrada");
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Cerrar la BD: " + e.Message);
            }
        }
    }
}