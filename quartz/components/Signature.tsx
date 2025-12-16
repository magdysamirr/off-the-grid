import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const Signature: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={`signature-wrapper ${displayClass ?? ""}`}>
        <a href="/" aria-label="Home">
          <img src="/static/signature.png" alt="Signature" class="signature-image" />
        </a>
      </div>
    )
  }

  return Signature
}) satisfies QuartzComponentConstructor
