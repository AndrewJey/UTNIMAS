//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ADMIN_PORTAL.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class PRODUCT
    {
        public int PRODUCTO_ID { get; set; }
        public string NOMBRE_PRODUCTO { get; set; }
        public int ID_PRECIO { get; set; }
        public string DESCRIP_PRODUCTO { get; set; }
        public byte[] FOTO_PRODCUTO { get; set; }
        public int EMPRESA_ID { get; set; }
    
        public virtual EMPRESA EMPRESA { get; set; }
        public virtual PRECIO PRECIO { get; set; }
    }
}
