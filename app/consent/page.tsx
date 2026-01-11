import Link from "next/link"

const bullet = [
  "Purpose of Data Collection: We collect your email address solely to gauge interest in our application and to notify you as soon as the service becomes available.",
  "Updates and News: By subscribing, you agree to receive occasional emails regarding our development progress, major milestones, and relevant updates about Path-Miner.",
  "Privacy and Security: No Data Selling: We never sell or trade your personal data.",
  "No Third Parties: Your information is not shared with third parties for marketing purposes.",
  "Confidentiality: All data is handled with strict confidentiality and stored securely.",
  "Free and Non-Binding: Joining the waitlist is completely free and carries no obligation to purchase or subscribe to any future paid services.",
  "Right to Withdraw: You can opt-out at any time. You may unsubscribe via the link provided in our emails or by contacting us through our website. Upon unsubscription, your data will be permanently deleted from our records.",
  "Data Controller: Path-Miner",
  "Website: https://www.path-miner.com/",
]

export default function ConsentPage() {
  return (
    <div className="min-h-screen bg-github-canvas text-github-fg">
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm text-accent-emphasis hover:text-white transition-colors"
          >
            ← Back to waitlist
          </Link>
        </div>

        <div className="rounded-2xl border border-github-border/50 bg-github-canvas-overlay/60 backdrop-blur-xl p-10 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-emphasis/30 bg-accent-emphasis/5 backdrop-blur-sm mb-6">
            <span className="text-sm text-white font-medium">Data Processing</span>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-github-fg">
            Data Processing Consent – Path-Miner Waitlist
          </h1>
          <p className="text-lg text-github-fg-muted mb-8">
            Thank you for your interest in Path-Miner! Your privacy is our top priority.
            By joining our waitlist, you agree to the following terms:
          </p>

          <ul className="space-y-4 text-github-fg-muted leading-relaxed">
            {bullet.map((item) => (
              <li key={item} className="pl-2">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
