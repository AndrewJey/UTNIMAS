//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace UTNIMAS.Models
{
    using System;
    using System.Collections.Generic;

    public partial class EMPRESA
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public EMPRESA()
        {
            this.PRODUCTS = new HashSet<PRODUCT>();
        }

        public int EMPRESA_ID { get; set; }
        public string NOMBRE_EMPRESA { get; set; }
        public string DIRECCION_EMPRESA { get; set; }
        public string NOMBRE_CONTACTO { get; set; }
        public string TELEF_CONTACTO { get; set; }
        public string EMAIL_EMPRESA { get; set; }
        public string SECTOR_PRODUCCION { get; set; }
        public Nullable<int> ID_CLIENTE { get; set; }

        public virtual CLIENT CLIENT { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<PRODUCT> PRODUCTS { get; set; }
    }
}
