using Microsoft.Agents.AI;
using System.Collections.Concurrent;

namespace GuitariaApi.Services;

public class SessionStore
{
    private readonly ConcurrentDictionary<Guid, AgentSession> _sessions = new();

    public void Store(Guid dbSessionId, AgentSession session) =>
        _sessions[dbSessionId] = session;

    public bool TryGet(Guid dbSessionId, out AgentSession? session) =>
        _sessions.TryGetValue(dbSessionId, out session);
}
