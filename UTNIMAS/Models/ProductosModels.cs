using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UTNIMAS.Models
{
    public class ProductosModels
    {
        public int PRODUCTOS_ID { get; set; }
        public string NOMBRE_PRODUCTO { get; set; }
        public int ID_PRECIO { get; set; }
        public string DESCRIP_PRODUCTO { get; set; }
        public dynamic FOTO_PRODUCTO { get; set; }
        public int EMPRESA_ID { get; set; }

    }
}