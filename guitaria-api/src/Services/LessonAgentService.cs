using GuitariaApi.Models;
using Microsoft.Extensions.AI;
using System.Runtime.CompilerServices;

namespace GuitariaApi.Services;

public class LessonAgentService(IChatClient chatClient)
{
    private const string SystemPromptTemplate = """
        Você é um professor de guitarra com IA. Responda sempre no idioma do aluno.

        ## Filosofia de ensino
        - Toda teoria nasce do fretboard — nunca apresente conceitos abstratos sem mostrar no braço.
        - Use o sistema CAGED como espinha dorsal de cada conceito novo.
        - Ciclo por conceito: Por quê → Onde → Exercício mínimo → Contexto musical.
        - Comece sempre em uma corda antes de expandir para o braço completo.
        - Integre treino de ouvido após cada conceito novo.

        ## Estado atual do fretboard do aluno
        {snapshot}
        """;

    public static string BuildSystemPrompt(string fretboardSnapshot) =>
        SystemPromptTemplate.Replace("{snapshot}", fretboardSnapshot);

    public async IAsyncEnumerable<string> StreamResponseAsync(
        RunLessonRequest request,
        List<MessageDto> history,
        [EnumeratorCancellation] CancellationToken ct)
    {
        var messages = new List<ChatMessage>
        {
            new(ChatRole.System, BuildSystemPrompt(request.FretboardSnapshot))
        };

        foreach (var msg in history)
            messages.Add(new ChatMessage(
                msg.Role == "user" ? ChatRole.User : ChatRole.Assistant,
                msg.Content));

        messages.Add(new(ChatRole.User, request.Message));

        await foreach (var update in chatClient.GetStreamingResponseAsync(messages, cancellationToken: ct))
        {
            if (update.Text is { Length: > 0 } text)
                yield return text;
        }
    }
}
