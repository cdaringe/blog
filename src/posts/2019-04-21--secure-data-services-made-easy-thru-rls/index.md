---
title: "secure data services made easy via rls"
slug: "secure-data-service-thru-rls"
date: "2019-04-20T00:50:56.000Z"
featured: false
draft: false
tags: ["programming", "linux", "web", "server"]
# cssFiles: ['index.css']
---

securing applications is hard. engineers must consider a diverse set of
concerns when building & delivering systems that handle sensitive data.  a cursory glance over the
[OWASP Top 10](https://www.owasp.org/images/7/72/OWASP_Top_10-2017_%28en%29.pdf.pdf)
reveals that securing an application against the top 10 risks is not
a matter of "installing this" or "turning this feature on"--rather, securing
an application involves auditing and considering design patterns employed
to exchange information. shortly, i will discuss how row-level security (rls)
can drastically improve part of our data-security story.

## it's easy to fail.  really easy.

we haven't made our technical lives much easier on some of these fronts.
let's focus on just _one_ of the OWASP risks, broken access control.  two of the many
possible side-effects of bad access control is exposure of data and
undesired mutation of data.  historically, software engineering teams have:

- protected against these risks at the application level, not at the data level
- tested data security manually, not via automation

bummer. so what does bad access control look like in practice?  here's some potential snippets:

```python
router.route("/api/person?fields=birthday", handler)
# ^ whoops, can anyone query everyone's birthday?

@authenticated(roles="member")
router.route("/api/person?fields=birthday", handler)
# ^ whoops, this limits who can access the data, but did
#   enforcing authentication fix the risk of over-exposure?

# handler.py - option 1
def handler():
  return psycopg.query("select birthday from persons")
  # ^ whoops, we're still exposing everyone's birthday, even if the user
  #   is an authenticated member. authorization is still broken

# handler.py - option 2
def handler():
  return psycopg.query("""
    select birthday from persons
    where <developer-writes-condition-he-thinks-is-safe>
  """)
```

our data layers often have a custom language or DSL to get at data--SQL, NoSQL, text files, etc--making
our interface to our datas brittle.  in `handler.py - option 2`,
the condition of `<developer-writes-condition-he-thinks-is-safe>` really _is not always robust_.
to keep focus, i'll leave it as an exercise to the reader to reason about how/why this
may be.

regardless, in just a few lines of code, we saw a variety of places were developers may
have easily exposed data.  it's worth noting that there are layers in our applications,
large call stacks separating our entrypoints from our data resolvers, often making
validation of the resultant queries difficult. the
`@authenticated` decorator could feasibly give a false positive to junior
developers, implying that this data flow is "secure", when--as discussed before--there
is much more to securing a service than meets the eye.

this example was purely a hypothetical mechanism for the failure.  make no
mistake, it appears these types of [security leaks are rampant](https://www.researchgate.net/publication/328956656_Quantitative_Assessment_on_Broken_Access_Control_Vulnerability_in_Web_Applications)
on the open web. we found such a leak at the office just two weeks ago from a team
of expert and respected engineers.  it's challenging, and it's real.

## rls to the rescue

rls let's you protect your data records _within_ the db. until recently,
database access models did not have access constraints at the per-record level--constraints
were generally available at every higher level resource.  this means that you could set RBAC
roles for a query, but if a user was querying say the `persons` tables, she'd
have access to _all persons_, which is problematic as demonstrated in our above snippets.

"so row-level security is going to save the day?"

pretty much.  what i'm hear to say is that rls is a _really good idea_.

if i can get you to [click this postgres rls link](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
and expose you to the concept, that alone is a big win.

## rls in practice

let's walk through an example. you can also complete this exercise whilst
following along with the [super-commerce](https://github.com/cdaringe/super-commerce)
codebase. feel free to clone it down and the the following example running hot.

let us:

1. write a schema to hold sensitive data
2. protect that sensitive information using rls
3. create some seed data and load everything into a database
4. write a tiny application that integrates with the db
5. reflect on the benefits of having protected the data closer to the data

