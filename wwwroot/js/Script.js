document.addEventListener('DOMContentLoaded', function () {
    const statusContainer = document.getElementById('statusContainer');
    const tabela = statusContainer.querySelector('.status-table');
    const tbody = tabela.querySelector('tbody');
    let dadosStatus = []; // Array para armazenar os dados de status
    let filtroAtual = 'todos'; // Variável para armazenar o estado do filtro

    async function atualizarStatus() {
        try {
            const response = await fetch('http://localhost:5231/api/status');
            dadosStatus = await response.json();
            tbody.innerHTML = '';
            aplicarFiltro();
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    }

    function aplicarFiltro() {
        let dadosFiltrados = dadosStatus;

        if (filtroAtual === 'online') {
            dadosFiltrados = dadosStatus.filter(item => item.status === 'ONLINE');
        } else if (filtroAtual === 'offline') {
            dadosFiltrados = dadosStatus.filter(item => item.status === 'OFFLINE');
        }

        atualizarTabela(dadosFiltrados);
    }

    function atualizarTabela(dados) {
        tbody.innerHTML = '';
        dados.forEach(item => {
            const ip = item.ip || 'Desconhecido';
            const status = item.status || 'Desconhecido';
            const latencia = item.latencia || 'N/A';
            const loja = item.loja;
            const circuito = item.circuito;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${loja}</td>
                <td>${circuito}</td>
                <td>${ip}</td>
                <td>${latencia}</td>
                <td class="${status.toLowerCase()}">${status}</td>
            `;
            tbody.appendChild(row);
        });
    }

    function filtrarOnline() {
        filtroAtual = 'online';
        aplicarFiltro();
    }

    function filtrarOffline() {
        filtroAtual = 'offline';
        aplicarFiltro();
    }

    function mostrarTodos() {
        filtroAtual = 'todos';
        atualizarTabela(dadosStatus);
    }

    document.getElementById('showOnline').addEventListener('click', filtrarOnline);
    document.getElementById('showOffline').addEventListener('click', filtrarOffline);
    document.getElementById('showAll').addEventListener('click', mostrarTodos);

    const addIpModalButton = document.getElementById('addIpModalButton');
    if (addIpModalButton) {
        addIpModalButton.addEventListener('click', function() {
            const modal = document.getElementById('modal');
            modal.style.display = 'block';
        });
    } else {
        console.error('Botão de adicionar IP não encontrado');
    }

    const closeModal = document.querySelector('.close');
    closeModal.addEventListener('click', function() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    });

    setInterval(atualizarStatus, 5000);
    atualizarStatus(); // Primeira atualização imediata
});
