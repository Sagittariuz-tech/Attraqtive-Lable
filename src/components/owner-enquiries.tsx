"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { categoryName, findProduct } from "@/data/catalogue";
import { enquiryStages, useDemoEnquiries, type DemoEnquiry } from "@/lib/demo-enquiries";
import { receiptDate } from "@/lib/demo-orders";

function EnquiryEditor({ enquiry }: { enquiry: DemoEnquiry }) {
  const [stage, setStage] = useState(enquiry.stage);
  const [followUp, setFollowUp] = useState(enquiry.followUp);
  const [message, setMessage] = useState("");
  const update = useDemoEnquiries(state => state.update);
  const garment = findProduct(enquiry.garment);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setMessage(await update(enquiry.id, stage, followUp) ? "Enquiry updated." : "The enquiry couldn’t be updated. Check the follow-up date and try again.");
    } catch {
      setMessage("The enquiry couldn’t be saved. Try again.");
    }
  }

  return <form className="enquiry-editor" onSubmit={save}>
    <dl className="enquiry-meta">
      <div><dt>Received</dt><dd>{receiptDate(enquiry.createdAt)}</dd></div>
      <div><dt>Preferred contact</dt><dd>{enquiry.method}</dd></div>
      <div><dt>Category</dt><dd>{enquiry.category ? categoryName(enquiry.category) : "Unspecified"}</dd></div>
      <div><dt>Occasion date</dt><dd>{enquiry.eventDate || "Unspecified"}</dd></div>
      {garment && <div><dt>Garment</dt><dd><Link className="plain-link" href={"/products/" + garment.slug + "/"}>{garment.title}</Link></dd></div>}
    </dl>
    <div className="owner-filters">
      <label>Enquiry stage<select value={stage} onChange={event => { setStage(event.target.value as DemoEnquiry["stage"]); setMessage(""); }}>
        {enquiryStages.map(item => <option key={item}>{item}</option>)}
      </select></label>
      <label>Follow-up date<input type="date" value={followUp} onChange={event => { setFollowUp(event.target.value); setMessage(""); }} /></label>
      <button className="button button-dark" type="submit">Save enquiry</button>
    </div>
    <p className="fine enquiry-feedback" role="status">{message}</p>
  </form>;
}

export function OwnerEnquiries() {
  const enquiries = useDemoEnquiries(state => state.enquiries);
  const [stage, setStage] = useState("");
  const [origin, setOrigin] = useState("");
  const visible = enquiries.filter(enquiry => (!stage || enquiry.stage === stage) && (!origin || enquiry.origin === origin));
  return <section id="enquiries" className="report-section">
    <div className="report-title"><div><h2>Bespoke enquiry queue</h2><p className="fine">Follow up on sample requests and demo submissions made in this browser.</p></div></div>
    <div className="owner-filters">
      <label>Filter enquiry stage<select value={stage} onChange={event => setStage(event.target.value)}>
        <option value="">All stages</option>{enquiryStages.map(item => <option key={item}>{item}</option>)}
      </select></label>
      <label>Enquiry source<select value={origin} onChange={event => setOrigin(event.target.value)}>
        <option value="">All sources</option><option>Sample</option><option>This browser</option>
      </select></label>
    </div>
    <p className="fine" role="status">{visible.length} {visible.length === 1 ? "enquiry" : "enquiries"} in view</p>
    {visible.map(enquiry => <details className="product-detail enquiry-entry" key={enquiry.id}>
      <summary>{enquiry.id} · {enquiry.service} · {enquiry.stage}{enquiry.followUp && " · Follow-up " + enquiry.followUp} <span className="report-badge">{enquiry.origin}</span></summary>
      <EnquiryEditor enquiry={enquiry} />
    </details>)}
  </section>;
}
