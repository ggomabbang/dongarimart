import { useMediaQuery } from "react-responsive";

export default function useDeviceSize() {
  const isDesktop = useMediaQuery({ query: "(min-width: 1025px)"});

  return { isDesktop };
}