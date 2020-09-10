/**
 * when importing this object, define "header"<Object> property for it
 */
export default {
  fact() {
    if (this.header.addedFuncs.indexOf("__scicave_rakam_fact__") === -1) {
      this.gamma();

      let fact = ["function __scicave_rakam_fact__(n) {", "  return __scicave_rakam_gamma__(n + 1);", "}"];

      this.header.addedFuncs.concat(["__scicave_rakam_fact__"]);

      this.header.push(...fact);
    }
  },

  gamma() {
    if (this.header.addedFuncs.indexOf("__scicave_rakam_gamma__") === -1) {
      let gamma = [
        "const __scicave_rakam_gammaG__ = 4.7421875;",
        "const __scicave_rakam_gammaP__ = [",
        "  0.99999999999999709182,",
        "  57.156235665862923517,",
        "  -59.597960355475491248,",
        "  14.136097974741747174,",
        "  -0.49191381609762019978,",
        "  0.33994649984811888699e-4,",
        "  0.46523628927048575665e-4,",
        "  -0.98374475304879564677e-4,",
        "  0.15808870322491248884e-3,",
        "  -0.21026444172410488319e-3,",
        "  0.2174396181152126432e-3,",
        "  -0.16431810653676389022e-3,",
        "  0.84418223983852743293e-4,",
        "  -0.2619083840158140867e-4,",
        "  0.36899182659531622704e-5,",
        "];",

        "function __scicave_rakam_product__(i, n) {",
        "  if (n < i) {",
        "    return NaN;",
        "  }",
        "  let _ = i++;",
        "  for (; i <= n; i++) {",
        "    _ *= i;",
        "  }",
        "  return _;",
        "}",

        "function __scicave_rakam_gamma__(n) {",
        "  let x;",
        "  if (n % 1 === 0) {",
        "    if (n <= 0) {",
        "      return isFinite(n) ? Infinity : NaN;",
        "    }",
        "    if (n > 171) {",
        "      return Infinity; // Will overflow",
        "    }",
        "    return __scicave_rakam_product__(1, n - 1); // factorial",
        "  }",
        "  if (n < 0.5) {",
        "    return Math.PI / (Math.sin(Math.PI * n) * __scicave_rakam_gamma__(1 - n));",
        "  }",
        "  if (n >= 171.35) {",
        "    return Infinity; // will overflow",
        "  }",
        "  if (n > 85.0) {",
        "    // Extended Stirling Approx",
        "    const twoN = n * n;",
        "    const threeN = twoN * n;",
        "    const fourN = threeN * n;",
        "    const fiveN = fourN * n;",
        "    return (",
        "      Math.sqrt((2 * Math.PI) / n) *",
        "      Math.pow(n / Math.E, n) *",
        "      (1 +",
        "        1 / (12 * n) +",
        "        1 / (288 * twoN) -",
        "        139 / (51840 * threeN) -",
        "        571 / (2488320 * fourN) +",
        "        163879 / (209018880 * fiveN) +",
        "        5246819 / (75246796800 * fiveN * n))",
        "    );",
        "  }",
        "  --n;",
        "  x = __scicave_rakam_gammaP__[0];",
        "  for (let i = 1; i < __scicave_rakam_gammaP__.length; ++i) {",
        "    x += __scicave_rakam_gammaP__[i] / (n + i);",
        "  }",
        "  const t = n + __scicave_rakam_gammaG__ + 0.5;",
        "  return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * x;",
        "}",
      ];

      this.header.addedFuncs.concat(["__scicave_rakam_product__", "__scicave_rakam_gamma__"]);

      this.header.addedVars.concat(["__scicave_rakam_gammaG__", "__scicave_rakam_gammaP__"]);

      this.header.push(...gamma);
    }
  },

  int() {
    if (this.header.addedFuncs.indexOf("__scicave_rakam_int__") === -1) {
      let int = ["function __scicave_rakam_int__(n) {", "  return __scicave_rakam_gamma__(n + 1);", "}"];

      this.header.addedFuncs.concat(["__scicave_rakam_int__"]);

      // this.header.concat(int);
      // concating will return a new array losing all defined props in header
      this.header.push(...int);
    }
  },
};