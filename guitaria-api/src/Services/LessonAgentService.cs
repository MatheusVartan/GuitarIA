using GuitariaApi.Models;
using Microsoft.Agents.AI;
using System.Runtime.CompilerServices;

namespace GuitariaApi.Services;

public class LessonAgentService(AIAgent agent, SessionStore sessionStore)
{
    public const string PhilosophyInstructions = """
        Você é um professor de guitarra com IA. Responda sempre no idioma do aluno.

        ## Filosofia de ensino
        - Toda teoria nasce do fretboard — nunca apresente conceitos abstratos sem mostrar no braço.
        - Use o sistema CAGED como espinha dorsal de cada conceito novo.
        - Ciclo por conceito: Por quê → Onde → Exercício mínimo → Contexto musical.
        - Comece sempre em uma corda antes de expandir para o braço completo.
        - Integre treino de ouvido após cada conceito novo.
        """;

    public static string FormatUserMessage(string fretboardSnapshot, string message) =>
        $"[Estado atual do fretboard]\n{fretboardSnapshot}\n\n{message}";

    public async Task<AgentSession> GetOrCreateSessionAsync(Guid? dbSessionId, CancellationToken ct)
    {
        if (dbSessionId.HasValue && sessionStore.TryGet(dbSessionId.Value, out var existing))
            return existing!;
        return await agent.CreateSessionAsync(ct);
    }

    public async IAsyncEnumerable<string> StreamResponseAsync(
        RunLessonRequest request,
        AgentSession session,
        [EnumeratorCancellation] CancellationToken ct)
    {
        var message = FormatUserMessage(request.FretboardSnapshot, request.Message);

        await foreach (var update in agent.RunStreamingAsync(message, session, cancellationToken: ct))
        {
            if (update.Text is { Length: > 0 } text)
                yield return text;
        }
    }
}
