using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using UTNIMAS.Models;

namespace UTNIMAS.Controllers
{
    public class CLIENTsController : Controller
    {
        private UTNIMASEntities db = new UTNIMASEntities();

        // GET: CLIENTs
        public ActionResult Index()
        {
            return View(db.CLIENTS.ToList());
        }

        // GET: CLIENTs/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            CLIENT cLIENT = db.CLIENTS.Find(id);
            if (cLIENT == null)
            {
                return HttpNotFound();
            }
            return View(cLIENT);
        }

        // GET: CLIENTs/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: CLIENTs/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "ID_CLIENT,NOMBRE1_CLIENT,NOMBRE2_CLIENT,APELLIDO1_CLIENT,APELLIDO2_CLIENT,DIRECCION1_CLIENT,CIUDAD_CLIENT,DISTRITO_CLIENT,CANTON_CLIENT,PROVINCIA_CLIENT,TELEF_CASA_CLIENT,TELF_CELULAR_CLIENT,EMAIL_CLIENT")] CLIENT cLIENT)
        {
            if (ModelState.IsValid)
            {
                db.CLIENTS.Add(cLIENT);
                db.SaveChanges();
                return RedirectToAction("Register", "Account");
            }

            return View(cLIENT);
        }

        // GET: CLIENTs/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            CLIENT cLIENT = db.CLIENTS.Find(id);
            if (cLIENT == null)
            {
                return HttpNotFound();
            }
            return View(cLIENT);
        }

        // POST: CLIENTs/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "ID_CLIENT,NOMBRE1_CLIENT,NOMBRE2_CLIENT,APELLIDO1_CLIENT,APELLIDO2_CLIENT,DIRECCION1_CLIENT,CIUDAD_CLIENT,DISTRITO_CLIENT,CANTON_CLIENT,PROVINCIA_CLIENT,TELEF_CASA_CLIENT,TELF_CELULAR_CLIENT,EMAIL_CLIENT")] CLIENT cLIENT)
        {
            if (ModelState.IsValid)
            {
                db.Entry(cLIENT).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(cLIENT);
        }

        // GET: CLIENTs/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            CLIENT cLIENT = db.CLIENTS.Find(id);
            if (cLIENT == null)
            {
                return HttpNotFound();
            }
            return View(cLIENT);
        }

        // POST: CLIENTs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            CLIENT cLIENT = db.CLIENTS.Find(id);
            db.CLIENTS.Remove(cLIENT);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
