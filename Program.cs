using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using System.Net.NetworkInformation;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);

// Adicionando serviços necessários
builder.Services.AddControllers();

var app = builder.Build();

// Configuração para servir arquivos estáticos (como index.html)
app.UseDefaultFiles();
app.UseStaticFiles();

// Lista de endereços IP ou nomes de host a serem monitorados com informações adicionais
var hostsParaMonitorar = new List<dynamic>
{
    new { Loja = "Loja 1", Circuito = "Circuito A", IP = "172.20.1.126" },
    new { Loja = "Loja 2", Circuito = "Circuito B", IP = "189.80.143.254" },
    new { Loja = "Loja 3", Circuito = "Circuito C", IP = "9.8.7.99" },
    new { Loja = "Loja 4", Circuito = "Circuito D", IP = "8.8.8.8" },
    new { Loja = "Loja 5", Circuito = "Circuito E", IP = "8.8.8.1" },
    new { Loja = "Loja 91", Circuito = "TESTE", IP = "8.8.8.3" },
};

// Endpoint API que retorna o status dos pings
app.MapGet("/api/status", () =>
{
    var resultados = new List<object>();

    // Verifica o status de cada host na lista
    foreach (var host in hostsParaMonitorar)
    {
        var resultado = VerificarPing(host.Loja, host.Circuito, host.IP);
        resultados.Add(resultado);
    }

    // Retorna a lista de resultados no formato JSON
    return resultados;
});

app.Run();

// Função para verificar ping e retornar informações no formato esperado
object VerificarPing(string loja, string circuito, string enderecoIP)
{
    try
    {
        using (Ping pingSender = new Ping())
        {
            PingReply reply = pingSender.Send(enderecoIP, 1000); // Timeout de 1 segundo

            // Retorna o status no formato esperado pela página web
            return new
            {
                Loja = loja,
                Circuito = circuito,
                IP = enderecoIP,
                Status = reply.Status == IPStatus.Success ? "ONLINE" : "OFFLINE",
                Latencia = reply.Status == IPStatus.Success ? $"{reply.RoundtripTime} ms" : "N/A"
            };
        }
    }
    catch (Exception ex)
    {
        // Em caso de erro, retorna uma mensagem de erro adequada
        return new
        {
            Loja = loja,
            Circuito = circuito,
            IP = enderecoIP,
            Status = "ERRO",
            Latencia = "N/A",
            Erro = ex.Message
        };
    }
}
