import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAW6IqBBiwiA2hgzDPt_s4_P_nk-8GTEfA",
  authDomain: "buildcore-labs.firebaseapp.com",
  projectId: "buildcore-labs",
  storageBucket: "buildcore-labs.firebasestorage.app",
  messagingSenderId: "413017471596",
  appId: "1:413017471596:web:83edcc580848ec2452b649"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    signInWithEmailAndPassword(auth, email, senha)
        .then(() => {
            window.location.href = "compatibilidade.html";
        })
        .catch((error) => {
            if (error.code === "auth/user-not-found") {
                alert("Usuário não encontrado.");
            } else if (error.code === "auth/wrong-password") {
                alert("Senha incorreta.");
            } else if (error.code === "auth/invalid-email") {
                alert("Email inválido.");
            } else {
                alert("Erro ao fazer login.");
            }
            console.log(error);
        });
});