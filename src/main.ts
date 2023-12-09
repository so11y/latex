import { createApp } from "vue";
import App from "./App.vue";
import Latex from "./features";
const app = createApp(App);

app.use(Latex);
app.mount("#app");
