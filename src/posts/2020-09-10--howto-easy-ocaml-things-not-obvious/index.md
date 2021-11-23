---
title: "howto: unwritten ocaml basics"
slug: unwritten-ocaml-basics
date: "2020-09-10T00:50:56.000Z"
featured: false
draft: false
tags: ["programming", "ocaml", "howto", "tutorial"]
# cssFiles: ['index.css']
---

I have recently been doing some coding in [ocaml](https://ocaml.org/). So far,
so good! However, even after a moderate amount of reading, searching, and even
asking in the ocaml discord chat channel, it is clear to me that there are
various essential knowledge gaps not well communicated in the manual or in
[realworldocaml](https://dev.realworldocaml.org/). Here are a handful of hot
ocaml bootstrapping tips.

## How should I learn ocaml?

- For reading, [realworldocaml](https://dev.realworldocaml.org/).
- For practice, [exercism](https://exercism.io/)
- For help,
  [ocaml#beginners](https://discuss.ocaml.org/t/ocaml-discord-server/1884)

Do all.

## How do I install ocaml?

Straight up, https://dev.realworldocaml.org/install.html.

## Things lazy people should probably know before skipping required reading

- `ocaml` and `utop` REPLs do _not resolve modules_ in the same way your
  compiler will.
  - compiler: explicitly tell your compiler what packages to pull in (syntax
    varies), which is not the same as...
  - repl/toplevel: `#require` and `open SomeModule` only to expose functionality
- Having your compiler and compiler configuration (e.g. dune library references)
  in order helps your developer tools
  - Even if you `opam install <some module>`, your editor may not pick it up
    until you've declared it properly in your dune file. 🤯. You may have
    thought your developer tooling (merlin, ocaml-lsp, & friends) just couldn't
    locate your package of interest. Fear not, it can, but everything demands
    that your compiler tooling be aligned as well.

## How do I compile?

There are various compilers. `ocamlc`, `ocamlbuild`, `ocamlopt`, whatever.

**Just use `dune`** in 2020. Who knows how this post will age, but start with
`dune`. Don't bother looking at the others.

## How do I compile to native-code vs byte-code, or vice-versa?

Read the [dune](https://dune.readthedocs.io/en/stable/quick-start.html) docs.

## How should I setup testing?

1. Create a test application:

```lisp
;dune
;...snip
(test
 (name test)
 (libraries ounit2 yourmodule)
 (modules test))
```

Ensure that you add your testing library/runner and the associated library you
want to test. Obnoxiously, because you may have a heirarchy as such:

```bash
$ ls -l
dune
yourmodule.ml
test.ml
```

you must tell `dune` which `*.ml` files should be built by a specfic built
target.

For example, for a layout like:

```bash
$ ls -l
dune
Replacements.ml
Redacto.ml
test.ml
```

my dune file looks simliar to:

```lisp
(library
 ...
 (modules replacements))

(executable
 ...
 (modules redacto))

(test
 ...
 (modules test))
```

Each `.ml` file has one place to be built in dune's eyes.

## How do I learn how to do async stuff?

You read Real World Ocaml, OR, you use existing knowledge of `Promise`s and use
the [lwt](https://github.com/ocsigen/lwt) library, which >1/2 of the OCaml
ecosystem seems to be aligned around.

## Can I watch a video on how to do async stuff?

No. There's no focused content in video form, at least on YouTube, distilled
down in a focused way. Maybe I'll be the guy to make that video ;).

## How do I pragmatically use regex?

It took searching and finding
[Regular Expressions vs Parser Combinators in OCaml ](https://pl-rants.net/posts/regexes-and-combinators-2/)
to finally come to a conclusion. `re2` is generally seen as a good pick, but
there is ~nil documentation on how to use it. The
[PCRE](https://mmottl.github.io/pcre-ocaml/) docs are good. The interfaces
between re2 and pcre are similar, so if you learn one you kind of learn both.
Start with PCRE if you want for ease of learning.

## What are tools are at my disposal?

There is a standard library, it is only ok.

JaneStreet `base` and `core` seem to be the go to std libary replacements. And
they quite literally do replace sections of the standard library, versus a
module that has no effect on your build. Candidly, I find this behavior
offensive. Don't expect to be able to have written some ocaml using the standard
library, then bring in one of these and have things just continue to work--some
minor refactors may be required. Install them from `opam`, per usual.

Edit: non-mutating stdlib replacement modules are available as well, such as
`containers` or `batteries`.

## How do I debug my OCaml program?

As far as I know--you don't. `printf`? I've seen some hints that there may be
tooling for emacs users? I've looked at the VSCode extensions, and there are
some promising work out there, but they aren't compatible with `ocaml@latest` at
the time of writing.

Edit: https://opam.ocaml.org/packages/earlybird/

## Is there an caml emoji?

🐫

Isn't it great?
