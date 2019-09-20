using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(UTNIMAS.Startup))]
namespace UTNIMAS
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
