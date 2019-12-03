using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using UserApi;
using System.Data.Entity;
using System;

namespace UsersApi.Controllers
{
    [Route("api/Users")]
    public class UserApiController : ApiController
    {
            
        public int GetAllUsers()
        {

            MyEntities1 db = new MyEntities1();
            var users = db.MyTable;
            return users.Count();
        }

        public IEnumerable<MyTable> GetUser(int page, int pageSize)
        {

            MyEntities1 db = new MyEntities1();
            var users = db.MyTable.OrderBy(x => x.id).Skip((page-1)* pageSize).Take(pageSize);
            return users;
        }
        public string toLog(string act)
        {
            MyEntities1 db = new MyEntities1();
            tAct s = new tAct();
            s.dateAct = DateTime.Now;
            s.Action = act;
            db.tAct.Add(s);
            db.SaveChanges();
            var acts = db.tAct;
            return acts.Count().ToString();
        }
    }
}