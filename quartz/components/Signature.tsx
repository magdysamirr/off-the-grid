import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const Signature: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={`signature-wrapper ${displayClass ?? ""}`}>
        <img src="/static/signature.png" alt="Signature" class="signature-image" />
      </div>
    )
  }

  return Signature
}) satisfies QuartzComponentConstructor
