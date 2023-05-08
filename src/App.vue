<template>
  <div id="app">
    <h1>Upload or paste image</h1>
    <div class="container-btn">
      <input
        :disabled="isLoading"
        ref="inputImg"
        @change="upLoadFile"
        type="file"
        class="default-file-input"
      />
      <button :disabled="isLoading" @click="onRecognize">Recognize</button>
      <button :disabled="isLoading" @click="onClear">Clear</button>
    </div>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="img-upload">
      <img id="output" ref="imgOutput" :src="urlImg" />
    </div>
    <div>
      <pre class="container-code">
          <div class="loading">
            <div v-if="isLoading" class="loading__style"></div>
          </div>
          <code v-if="!isLoading" class="container-code__text">
            {{ resultText }}
          </code>
        </pre>
    </div>
    <div v-if="resultText">
      <button @click="onCopyText">copy</button>
      <button @click="onTranslate">translate</button>
      <div>
        <pre class="container-code">
          <div class="loading">
            <div v-if="isTranslating" class="loading__style"></div>
          </div>
          <code v-if="!isTranslating">
           <div class="container-code__text">
            {{ viText }}
          </div>
          </code>
        </pre>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { createWorker, PSM, OEM } from "tesseract.js";
const worker = createWorker({
  // logger: (m) => console.log(m),
});

import axios from "axios";

export default {
  name: "app",
  data() {
    return {
      urlImg: "",
      resultText: "",
      viText: "",
      error: "",
      isLoading: false,
      isTranslating: false,
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
      this.viText = "";
    },
    async onRecognize() {
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
      this.resultText = text;
    },
    async onTranslate() {
      const encodedParams = new URLSearchParams();
      encodedParams.set("source_language", "en");
      encodedParams.set("target_language", "vi");
      encodedParams.set("text", this.resultText);

      const options = {
        method: "POST",
        url: "https://text-translator2.p.rapidapi.com/translate",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key":
            "de56ddd1a0msh907cb13aa9b0659p180618jsn76131942316e",
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
        },
        data: encodedParams,
      };

      try {
        this.isTranslating = true;
        const response = await axios.request(options);
        // console.log(response.data);
        this.viText = response.data.data.translatedText || "";
      } catch (error) {
        console.error(error);
        this.viText = "";
      } finally {
        this.isTranslating = false;
      }
    },
    onCopyText() {
      if (!this.resultText) return;
      navigator.clipboard.writeText(this.resultText);
    },
  },
  created() {
    console.log(
      "%cStop!, u are chicken",
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
}

.container-btn {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button + button {
  margin-left: 5px;
}
.img-upload {
  margin: 20px 0;
}
.img-upload img {
  max-width: 500px;
  max-height: 400px;
}
.container-code {
  background-color: #f8f8f8;
}
.container-code__text {
  max-width: 60vw;
  margin: auto;
  white-space: break-spaces;
  font-size: 18px;
}
.error {
  color: red;
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
