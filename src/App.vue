<template>
  <div id="app">
    <h1>Image => Text</h1>
    <div class="container-btn">
      <input
        ref="inputImg"
        @change="upLoadFile"
        type="file"
        class="default-file-input"
      />
      <button @click="recognize">Recognize</button>
      <button @click="onClear">Clear</button>
    </div>
    <p v-if="error" style="color: red">{{ error }}</p>
    <div>
      <h2>Images upload</h2>
      <img
        id="output"
        ref="imgOutput"
        :src="urlImg"
        style="max-width: 500px; max-height: 400px"
      />
    </div>

    <div>
      <pre class="container-code">
          <div class="loading">
            <div v-if="isLoading" class="loading__style"></div>
          </div>
          <code v-if="!isLoading">
            {{ resultText }}
          </code>
        </pre>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { createWorker, PSM, OEM } from "tesseract.js";
const worker = createWorker({
  // logger: (m) => console.log(m),
});

export default {
  name: "app",
  data() {
    return {
      urlImg: "",
      resultText: "",
      error: "",
      isLoading: false,
    };
  },
  methods: {
    upLoadFile(e) {
      //funtion to upload image into delfau titles
      if (!e.target.files[0]) return;
      this.getUrl(e.target.files[0]);
    },
    getUrl(link) {
      this.error = "";
      this.urlImg = URL.createObjectURL(link);
    },
    onClear() {
      this.urlImg = "";
      this.resultText = "";
      this.error = "";
      this.$refs.inputImg.value = "";
    },
    async recognize() {
      const img = this.$refs.imgOutput; // document.getElementById("output");
      if (!this.urlImg) {
        this.error = "Input Image";
        return;
      }
      this.isLoading = true;
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng", OEM.LSTM_ONLY);
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });
      const {
        data: { text },
      } = await worker.recognize(img);

      this.isLoading = false;
      // console.log(text);
      this.resultText = text;
    },
  },
  created() {
    console.log(
      "%cStop!",
      "color: red; font-family: sans-serif; font-size: 4.5em; font-weight: bolder; text-shadow: #000 1px 1px;"
    );
  },
  mounted() {
    window.addEventListener("paste", (e) => {
      this.$refs.inputImg.files = e.clipboardData.files;
      this.getUrl(e.clipboardData.files[0]);
    });
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.container-btn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
button + button {
  margin-left: 5px;
}
.container-code {
  background-color: #f8f8f8;
}
.loading {
  display: flex;
  justify-content: center;
}
.loading__style {
  --w: 10ch;
  font-weight: bold;
  font-family: monospace;
  font-size: 30px;
  line-height: 1.2em;
  letter-spacing: var(--w);
  width: var(--w);
  overflow: hidden;
  white-space: nowrap;
  color: #0000;
  animation: c9 2s infinite linear;
}
.loading__style:before {
  content: "Loading...";
}

@keyframes c9 {
  0% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0,
      calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0,
      calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  4% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0,
      calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0,
      calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  8% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0,
      calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0,
      calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  12% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000,
      calc(-2 * var(--w)) 0 #000, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0,
      calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0,
      calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  16% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000,
      calc(-2 * var(--w)) 0 #000, calc(-3 * var(--w)) 0 #000,
      calc(-4 * var(--w)) 0, calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0,
      calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  20% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000,
      calc(-2 * var(--w)) 0 #000, calc(-3 * var(--w)) 0 #000,
      calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0,
      calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  24% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000,
      calc(-2 * var(--w)) 0 #000, calc(-3 * var(--w)) 0 #000,
      calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0,
      calc(-9 * var(--w)) 0;
  }
  28% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000,
      calc(-2 * var(--w)) 0 #000, calc(-3 * var(--w)) 0 #000,
      calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0, calc(-8 * var(--w)) 0,
      calc(-9 * var(--w)) 0;
  }
  32% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000,
      calc(-2 * var(--w)) 0 #000, calc(-3 * var(--w)) 0 #000,
      calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000,
      calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
  36% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000,
      calc(-2 * var(--w)) 0 #000, calc(-3 * var(--w)) 0 #000,
      calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000,
      calc(-8 * var(--w)) 0 #000, calc(-9 * var(--w)) 0;
  }
  40%,
  60% {
    text-shadow: calc(0 * var(--w)) 0 #000, calc(-1 * var(--w)) 0 #000,
      calc(-2 * var(--w)) 0 #000, calc(-3 * var(--w)) 0 #000,
      calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000,
      calc(-8 * var(--w)) 0 #000, calc(-9 * var(--w)) 0 #000;
  }
  64% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0 #000,
      calc(-2 * var(--w)) 0 #000, calc(-3 * var(--w)) 0 #000,
      calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000,
      calc(-8 * var(--w)) 0 #000, calc(-9 * var(--w)) 0 #000;
  }
  68% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0 #000, calc(-3 * var(--w)) 0 #000,
      calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000,
      calc(-8 * var(--w)) 0 #000, calc(-9 * var(--w)) 0 #000;
  }
  72% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0 #000,
      calc(-4 * var(--w)) 0 #000, calc(-5 * var(--w)) 0 #000,
      calc(-6 * var(--w)) 0 #000, calc(-7 * var(--w)) 0 #000,
      calc(-8 * var(--w)) 0 #000, calc(-9 * var(--w)) 0 #000;
  }
  76% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0 #000,
      calc(-5 * var(--w)) 0 #000, calc(-6 * var(--w)) 0 #000,
      calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0 #000;
  }
  80% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0,
      calc(-5 * var(--w)) 0 #000, calc(-6 * var(--w)) 0 #000,
      calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0 #000;
  }
  84% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0,
      calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0 #000,
      calc(-7 * var(--w)) 0 #000, calc(-8 * var(--w)) 0 #000,
      calc(-9 * var(--w)) 0 #000;
  }
  88% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0,
      calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0 #000,
      calc(-8 * var(--w)) 0 #000, calc(-9 * var(--w)) 0 #000;
  }
  92% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0,
      calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0,
      calc(-8 * var(--w)) 0 #000, calc(-9 * var(--w)) 0 #000;
  }
  96% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0,
      calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0,
      calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0 #000;
  }
  100% {
    text-shadow: calc(0 * var(--w)) 0, calc(-1 * var(--w)) 0,
      calc(-2 * var(--w)) 0, calc(-3 * var(--w)) 0, calc(-4 * var(--w)) 0,
      calc(-5 * var(--w)) 0, calc(-6 * var(--w)) 0, calc(-7 * var(--w)) 0,
      calc(-8 * var(--w)) 0, calc(-9 * var(--w)) 0;
  }
}
</style>
