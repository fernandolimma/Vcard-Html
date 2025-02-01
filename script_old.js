
const SCOPES = "https://www.googleapis.com/auth/contacts";
let googleAuth; // Variável para armazenar a instância de autenticação

// Função para inicializar a API do Google
function initializeGoogleAPI() {
    if (typeof gapi === "undefined") {
        console.error("Erro: gapi não carregado. Verifique se o script da API do Google foi incluído corretamente.");
        return;
    }

    gapi.load("client:auth2", () => {
        gapi.client
            .init({
                apiKey: "SUA_API_KEY",
                clientId: "SEU_CLIENT_ID",
                discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
                scope: "https://www.googleapis.com/auth/contacts",
            })
            .then(() => {
                googleAuth = gapi.auth2.getAuthInstance();
                console.log("Cliente Google inicializado com sucesso.");
            })
            .catch((error) => {
                console.error("Erro ao inicializar o cliente Google:", error);
                alert("Erro ao inicializar o cliente Google. Verifique as configurações.");
            });
    });
}



// Função para carregar dinamicamente o script da API do Google
function loadGoogleAPIScript(callback) {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = callback; // Chama a função `initializeGoogleAPI` quando o script estiver carregado
    script.onerror = () => {
        console.error("Erro ao carregar o script da API do Google.");
    };
    document.head.appendChild(script);
}

// Função para salvar o contato no Google
function saveContact() {
    const contact = {
        names: [{ givenName: "Fernando", familyName: "Lima" }],
        phoneNumbers: [{ value: "+5532991144887" }],
        emailAddresses: [{ value: "fernandoaslima@hotmail.com" }],
        organizations: [{ name: "Vórtice", title: "CEO" }],
        addresses: [{ streetAddress: "Juiz de Fora-MG" }],
    };

    gapi.client.people.people
        .createContact({ resource: contact })
        .then((response) => {
            console.log("Contato salvo com sucesso:", response);
            alert("Contato salvo na sua conta do Google!");
        })
        .catch((error) => {
            console.error("Erro ao salvar o contato:", error);
            alert("Erro ao salvar contato: verifique as permissões.");
        });
}

// Evento do botão "Salvar Contato"
document.getElementById("salvar-contato").addEventListener("click", () => {
    const btn = document.getElementById("salvar-contato");
    btn.disabled = true;
    btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> Salvando...";

    if (googleAuth) {
        if (googleAuth.isSignedIn.get()) {
            saveContact();
        } else {
            googleAuth.signIn().then(() => {
                saveContact();
            }).catch((error) => {
                console.error("Erro ao autenticar o usuário:", error);
                alert("Erro ao autenticar. Por favor, tente novamente.");
            });
        }
    } else {
        alert("API Google não inicializada corretamente. Por favor, recarregue a página.");
    }

    // Reabilitar botão depois da ação
    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = "<i class='fa-solid fa-address-book'></i> Salvar Contato";
    }, 3000); // Retorna o botão ao normal após 3 segundos
});


// Compartilhar contato
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


// Carrega o script da API do Google e inicializa a API
document.addEventListener("DOMContentLoaded", () => {
    loadGoogleAPIScript(initializeGoogleAPI); // Função de inicialização do Google API
});

