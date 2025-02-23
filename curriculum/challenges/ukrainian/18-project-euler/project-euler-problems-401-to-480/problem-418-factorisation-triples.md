---
id: 5900f50f1000cf542c510021
title: 'Problem 418: Factorisation triples'
challengeType: 1
forumTopicId: 302087
dashedName: problem-418-factorisation-triples
---

# --description--

Нехай $n$ буде натуральним числом. An integer triple ($a$, $b$, $c$) is called a factorisation triple of $n$ if:

- $1 ≤ a ≤ b ≤ c$
- $a \times b \times c = n$.

Define $f(n)$ to be $a + b + c$ for the factorisation triple ($a$, $b$, $c$) of $n$ which minimises $\frac{c}{a}$. One can show that this triple is unique.

Наприклад, $f(165) = 19$, $f(100\\,100) = 142$ та $f(20!) = 4\\,034\\,872$.

Знайдіть $f(43!)$.

# --hints--

`factorisationTriples()` має повернути `1177163565297340400`.

```js
assert.strictEqual(factorisationTriples(), 1177163565297340400);
```

# --seed--

## --seed-contents--

```js
function factorisationTriples() {

  return true;
}

factorisationTriples();
```

# --solutions--

```js
// solution required
```
