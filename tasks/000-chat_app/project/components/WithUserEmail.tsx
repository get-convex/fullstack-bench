export function WithUserEmail(props: { children: React.ReactNode }) {
  return <>{props.children}</>;
}

export function useUserEmail() {
  return "joe@example.com";
}
