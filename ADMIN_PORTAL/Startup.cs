using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ADMIN_PORTAL.Startup))]
namespace ADMIN_PORTAL
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
