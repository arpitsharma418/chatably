export function getConversationPeer(conversation, currentUserId) {
  if (!conversation || !currentUserId) {
    return null;
  }

  return (
    conversation.members?.find((member) => member?._id !== currentUserId) || null
  );
}
