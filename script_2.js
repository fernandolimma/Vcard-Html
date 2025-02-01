// Configurações do cliente
const CLIENT_ID = "SEU_CLIENT_ID";
const API_KEY = "SUA_API_KEY";
const SCOPES = "https://www.googleapis.com/auth/contacts";

// Função para inicializar o Google Identity Services
function initializeGoogleIdentity() {
    if (typeof google === "undefined" || !google.accounts || !google.accounts.id) {
        console.error("Erro: Biblioteca Google Identity Services não carregada.");
        return;
    }

    // Inicializa o Google Identity Services
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse, // Função de callback para o token de autenticação
    });

    // Renderiza o botão de login (opcional)
    google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        { theme: "outline", size: "large" } // Personalize o botão
    );

    // Solicita automaticamente o token de autenticação (opcional)
    google.accounts.id.prompt();
}

// Função de callback para o token de autenticação
function handleCredentialResponse(response) {
    if (response.error) {
        console.error("Erro ao autenticar:", response.error);
        alert("Erro ao autenticar. Por favor, tente novamente.");
        return;
    }

    // Extrai o token de autenticação
    const idToken = response.credential;

    // Carrega a biblioteca `gapi` dinamicamente
    loadGapi().then(() => {
        // Autentica com a API People do Google
        authenticateWithGoogleAPI(idToken);
    }).catch((error) => {
        console.error("Erro ao carregar a biblioteca gapi:", error);
    });
}

// Função para carregar a biblioteca `gapi`
function loadGapi() {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            gapi.load("client", () => {
                console.log("Biblioteca gapi carregada com sucesso.");
                resolve();
            });
        };
        script.onerror = () => {
            reject(new Error("Erro ao carregar a biblioteca gapi."));
        };
        document.head.appendChild(script);
    });
}

// Função para autenticar com a API People do Google
function authenticateWithGoogleAPI(idToken) {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
        scope: SCOPES,
    }).then(() => {
        console.log("API Google inicializada com sucesso.");
        // Configura o token de autenticação
        gapi.client.setToken({ access_token: idToken });
    }).catch((error) => {
        console.error("Erro ao inicializar a API Google:", error);
        alert("Erro ao inicializar a API Google. Verifique as configurações.");
    });
}

// Função para salvar o contato
function saveContact() {
    const contact = {
        names: [{ givenName: "Fernando", familyName: "Lima" }],
        phoneNumbers: [{ value: "+5532991144887" }],
        emailAddresses: [{ value: "fernandoaslima@hotmail.com" }],
        organizations: [{ name: "Vórtice", title: "CEO" }],
        addresses: [{ streetAddress: "Juiz de Fora-MG" }],
    };

    gapi.client.people.people.createContact({
        resource: contact
    }).then((response) => {
        console.log("Contato salvo com sucesso:", response);
        alert("Contato salvo na sua conta do Google!");
    }).catch((error) => {
        console.error("Erro ao salvar o contato:", error);
        alert("Erro ao salvar contato: verifique as permissões.");
    });
}

// Evento do botão "Salvar Contato"
document.getElementById("salvar-contato").addEventListener("click", () => {
    const btn = document.getElementById("salvar-contato");
    btn.disabled = true;
    btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Salvando...";

    if (gapi.client.getToken()) {
        saveContact();
    } else {
        alert("Por favor, faça login com o Google antes de salvar o contato.");
    }

    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = "<i class='fa-solid fa-address-book'></i> Salvar Contato";
    }, 3000);
});



// Evento do botão "Compartilhar Contato"
document.getElementById("compartilhar-contato").addEventListener("click", () => {
    const contact = {
        name: "Fernando Lima",
        tel: "+5532991144887",
        email: "fernandoaslima@hotmail.com",
        address: "Juiz de Fora-MG",
        organization: "Vórtice",
        note: "CEO",
    };

    if (navigator.canShare && navigator.share) {
        navigator.share({
            title: contact.name,
            text: `Nome: ${contact.name}\nOrganização: ${contact.organization}\nTelefone: ${contact.tel}\nEmail: ${contact.email}\nEndereço: ${contact.address}`,
        }).then(() => {
            console.log("Contato compartilhado com sucesso");
        }).catch((err) => {
            console.error("Erro ao compartilhar contato:", err);
        });
    } else {
        alert("Este dispositivo não suporta o recurso de compartilhamento! Por favor, use um dispositivo compatível.");
    }
});

// Inicializa o Google Identity Services quando a página carregar
document.addEventListener("DOMContentLoaded", initializeGoogleIdentity);