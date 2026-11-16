"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Activity, ArrowRight, Download, PackageSearch, ShoppingBag, TrendingUp } from "lucide-react";
import { categories, categoryName, products } from "@/data/catalogue";
import { demoAccounts, useDemoAuth } from "@/lib/demo-auth";
import { fulfilmentStatuses, nextFulfilment, paymentStatuses, receiptDate, useDemoOrders, type DemoReceipt } from "@/lib/demo-orders";
import { money } from "@/lib/commerce";
import { netTotal, ownerReport, reportCsv, reportPeriods, seedOwnerReport } from "@/lib/owner-report";
import { DemoSignIn } from "./demo-sign-in";
import { OwnerEnquiries } from "./owner-enquiries";

const whole = new Intl.NumberFormat("en-IN");
const percent = (value: number | null) => value === null ? "—" : new Intl.NumberFormat("en-IN", { style: "percent", maximumFractionDigits: 1 }).format(value);
const shortDate = (value: number) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(value);
const demandOptions = [["units", "Units sold"], ["sales", "Net sales"], ["views", "Product views"], ["saves", "Wishlist saves"], ["enquiries", "Enquiries"]] as const;
type DemandKey = (typeof demandOptions)[number][0];

export function OwnerDashboard() {
  const { ready, role, signOut } = useDemoAuth();
  if (!ready) return <p role="status">Loading owner preview…</p>;
  if (role !== "admin") return <div className="narrow">
    <div className="page-heading"><p className="eyebrow">Demo owner access</p><h1>Owner dashboard</h1><p>Sign in as the boutique owner to view sample reports.</p></div>
    {role === "customer" && <p className="notice">You’re signed in as the demo customer. Owner sign-in switches the role in this tab.</p>}
    <DemoSignIn allowed="admin" />
  </div>;
  return <Dashboard onSignOut={signOut} />;
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return <div className="owner-metric"><dt>{label}</dt><dd>{value}</dd>{detail && <dd className="fine">{detail}</dd>}</div>;
}

function ReportTable({ label, children }: { label: string; children: ReactNode }) {
  return <div className="report-scroll" tabIndex={0} role="region" aria-label={label}><table>{children}</table></div>;
}

function OrderActions({ receipt }: { receipt: DemoReceipt }) {
  const update = useDemoOrders(state => state.updateOrder);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const next = nextFulfilment(receipt);

  async function apply(action: "advance" | "refund" | "restock") {
    setPending(true);
    setMessage("");
    try { await update(receipt.id, action, receipt.fulfilment); }
    catch { setMessage("The demo order couldn’t be updated."); }
    finally { setPending(false); }
  }

  return <div className="order-actions">
    {next && <button type="button" className="plain-link" disabled={pending} onClick={() => void apply("advance")}>Mark {next.toLowerCase()}</button>}
    {receipt.payment === "Paid" && <button type="button" className="plain-link" disabled={pending} onClick={() => void apply("refund")}>Simulate full refund</button>}
    {receipt.payment === "Refunded" && !receipt.restocked && <button type="button" className="plain-link" disabled={pending} onClick={() => void apply("restock")}>Return units to stock</button>}
    {receipt.restocked && <p className="fine">Units returned to sample stock.</p>}
    {message && <p className="error" role="alert">{message}</p>}
  </div>;
}

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [now] = useState(Date.now);
  const [data] = useState(() => seedOwnerReport(now));
  const [period, setPeriod] = useState<(typeof reportPeriods)[number]>(30);
  const [category, setCategory] = useState("");
  const [rank, setRank] = useState<DemandKey>("units");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const [source, setSource] = useState("");
  const [orderLimit, setOrderLimit] = useState(8);
  const receipts = useDemoOrders(state => state.receipts);
  const reportNow = receipts.reduce((latest, receipt) => Math.max(latest, Date.parse(receipt.refundedAt ?? receipt.createdAt)), now);
  const report = ownerReport(data, receipts, reportNow, period, category);
  const demand = [...report.demand].sort((a, b) => b[rank] - a[rank] || b.units - a.units);
  const leadingStyle = [...report.demand].sort((a, b) => b.units - a.units)[0];
  const enquiryStyle = [...report.demand].sort((a, b) => b.enquiries - a.enquiries)[0];
  const orders = report.orders.filter(order => (!status || order.fulfilment === status) && (!payment || order.payment === payment) && (!source || order.source === source));
  const maxBar = Math.max(1, ...report.trend.map(point => point.value));
  const lowStock = report.variants.filter(item => item.onHand <= 1);
  const stockouts = lowStock.filter(item => item.onHand === 0);
  const stockPriority = lowStock.find(item => item.units > 0);
  const awaiting = report.orders.filter(order => order.payment === "Paid" && (order.fulfilment === "Processing" || order.fulfilment === "Ready for pickup"));
  const browserCount = report.orders.filter(order => order.source === "This browser").length;

  function download() {
    const url = URL.createObjectURL(new Blob([reportCsv(orders)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "attraqtive-demo-orders-" + period + "d.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <>
    <div className="owner-heading">
      <div className="page-heading"><p className="eyebrow">Boutique owner · Demonstration</p><h1>Owner dashboard</h1>
        <p>Review sales, garment demand, stock and follow-ups for the sample boutique.</p></div>
      <div className="owner-session"><span>{demoAccounts.admin.email}</span><button type="button" className="plain-link" onClick={onSignOut}>Sign out</button></div>
    </div>
    <nav aria-label="Dashboard sections" className="collection-nav dashboard-nav">
      <a href="#sales"><TrendingUp size={16} /> Sales</a><a href="#demand"><Activity size={16} /> Style demand</a>
      <a href="#inventory"><PackageSearch size={16} /> Stock</a><a href="#orders"><ShoppingBag size={16} /> Orders</a><a href="#enquiries">Enquiry queue</a>
    </nav>
    <p className="notice">Demo owner access. Seeded sales, costs and product traffic are illustrative. {browserCount ? browserCount + " simulated order" + (browserCount === 1 ? "" : "s") + " from this browser included in this view." : "Completed demo orders from this browser appear here when they match the filters."}</p>
    <div className="owner-filters">
      <label>Period<select value={period} onChange={event => { setPeriod(Number(event.target.value) as typeof period); setOrderLimit(8); }}>
        {reportPeriods.map(days => <option key={days} value={days}>Last {days} days</option>)}
      </select></label>
      <label>Collection category<select value={category} onChange={event => { setCategory(event.target.value); setOrderLimit(8); }}>
        <option value="">All categories</option>{categories.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}
      </select></label>
    </div>

    <section id="sales" className="report-section">
      <div className="report-title"><h2>Sales overview</h2><p className="fine">Net sales use order dates. Refund totals use refund dates.</p></div>
      <dl className="owner-metrics">
        <Metric label="Net sales" value={money(report.netSales)} detail={report.previousSales ? percent((report.netSales - report.previousSales) / report.previousSales) + " vs. previous period" : "No previous period sales"} />
        <Metric label="Sales orders" value={whole.format(report.paidOrders)} detail={whole.format(report.units) + " units sold"} />
        <Metric label="Average order" value={money(report.avgOrder)} detail="Net sales per sales order" />
        <Metric label="Refunds" value={money(report.refundValue)} detail={whole.format(report.refundedOrders) + " refunded orders"} />
        <Metric label="Gross margin estimate" value={percent(report.grossMargin)} detail="Seeded orders with sample costs" />
        <Metric label="Returning customers" value={percent(report.repeatRate)} detail="Seeded buyers with an earlier sale" />
      </dl>
      <div className="report-columns">
        <section className="report-panel"><h3>Sales over time</h3>
          <div className="sales-chart">{report.trend.map(point => <div key={point.to} className="sales-column">
            <span className="fine" title={money(point.value)}>{money(point.value)}</span>
            <div className="bar-track"><div style={{ height: (point.value / maxBar) * 100 + "%" }} /></div>
            <span>{shortDate(point.to)}</span>
          </div>)}</div>
          <p className="fine">Each bar ends on the date shown, in India time.</p>
        </section>
        <section className="report-panel"><h3>Sales by channel</h3>
          <dl className="channel-list">{report.channelSales.map(item => <div key={item.label}><dt>{item.label}<small>{item.orders} sales orders</small></dt><dd>{money(item.sales)}</dd></div>)}</dl>
          <h3>Top cities</h3><dl className="channel-list">{report.citySales.slice(0, 4).map(item => <div key={item.label}><dt>{item.label}</dt><dd>{money(item.sales)}</dd></div>)}</dl>
          {!report.citySales.length && <p className="fine">No seeded city sales in this view.</p>}
        </section>
      </div>
    </section>

    <section id="demand" className="report-section">
      <div className="report-title"><div><h2>Style demand</h2><p className="fine">Compare views, bag adds, sales, returns and bespoke interest by garment.</p></div>
        <label className="report-select">Rank by<select value={rank} onChange={event => setRank(event.target.value as DemandKey)}>
          {demandOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
      <div className="owner-insights">
        {leadingStyle?.units > 0 && <p><strong>Top seller</strong><Link href={"/products/" + leadingStyle.product.slug + "/"}>{leadingStyle.product.title}</Link><span>{leadingStyle.units} units sold</span></p>}
        {enquiryStyle?.enquiries > 0 && <p><strong>Most enquiries</strong><Link href={"/products/" + enquiryStyle.product.slug + "/"}>{enquiryStyle.product.title}</Link><span>{enquiryStyle.enquiries} seeded enquiries</span></p>}
      </div>
      <ReportTable label="Style demand report">
        <thead><tr><th scope="col">Style / SKU</th><th scope="col">Views</th><th scope="col">Saved</th><th scope="col">Bag adds</th><th scope="col">Enquiries</th><th scope="col">Units</th><th scope="col">Refunded units</th><th scope="col">Net sales</th><th scope="col">Sample stock</th></tr></thead>
        <tbody>{demand.map(item => <tr key={item.product.sku}><th scope="row"><Link href={"/products/" + item.product.slug + "/"}>{item.product.title}</Link>
          <small>{item.product.sku} · {categoryName(item.product.category)}</small></th><td>{whole.format(item.views)}</td><td>{whole.format(item.saves)}</td><td>{whole.format(item.bagAdds)}</td>
          <td>{whole.format(item.enquiries)}</td><td>{item.units}</td><td>{item.refundedUnits}</td><td>{money(item.sales)}</td><td>{item.stock ?? "Bespoke"}</td></tr>)}</tbody>
      </ReportTable>
    </section>

    <section id="inventory" className="report-section">
      <div className="report-title"><div><h2>Stock &amp; follow-ups</h2><p className="fine">Current sample variant stock and orders that need attention.</p></div></div>
      {stockPriority && <p className="notice"><strong>Restock candidate:</strong> {stockPriority.product.title} · {stockPriority.variant.colour} / {stockPriority.variant.size} sold {stockPriority.units} units in this period and has {stockPriority.onHand} on hand.</p>}
      <div className="report-columns operations-columns">
        <section className="report-panel"><h3>Demand by variant</h3>
          <p className="fine">{stockouts.length} variants out of stock · {lowStock.length - stockouts.length} with one left. On-hand counts reflect demo orders in this browser.</p>
          <ReportTable label="Variant demand and stock"><thead><tr><th scope="col">Style</th><th scope="col">Size / colour</th><th scope="col">Units sold</th><th scope="col">On hand</th></tr></thead>
            <tbody>{report.variants.map(({ product, variant, units, onHand }) => <tr key={variant.id}><th scope="row">{product.title}<small>{variant.id}</small></th><td>{variant.size} / {variant.colour}</td><td>{units}</td><td>
              <span className="report-badge" data-alert={onHand === 0}>{onHand}</span></td></tr>)}</tbody>
          </ReportTable>
          {!report.variants.length && <p className="fine">No retail variants in this view.</p>}
        </section>
        <section className="report-panel"><h3>Order follow-up</h3>
          <ul className="follow-ups">{awaiting.slice(0, 6).map(order => <li key={order.id}><strong>{order.id}</strong><span>{order.fulfilment} · {order.channel}</span></li>)}</ul>
          {!awaiting.length && <p className="fine">No processing orders or pickups in this view.</p>}
          <a className="text-link" href="#enquiries">Open enquiry queue <ArrowRight size={15} /></a>
        </section>
      </div>
    </section>

    <section id="orders" className="report-section">
      <div className="report-title"><div><h2>Order register</h2><p className="fine">Filter the register or open an order from this browser to update its demo status.</p></div>
        <button className="button button-outline" type="button" disabled={!orders.length} onClick={download}><Download size={17} /> Export CSV</button></div>
      <div className="owner-filters">
        <label>Fulfilment status<select value={status} onChange={event => { setStatus(event.target.value); setOrderLimit(8); }}>
          <option value="">All fulfilment states</option>{fulfilmentStatuses.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Payment status<select value={payment} onChange={event => { setPayment(event.target.value); setOrderLimit(8); }}>
          <option value="">All payment states</option>{paymentStatuses.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Order source<select value={source} onChange={event => { setSource(event.target.value); setOrderLimit(8); }}>
          <option value="">All sources</option><option>Seeded</option><option>This browser</option></select></label>
      </div>
      <p className="fine" role="status">{orders.length} {orders.length === 1 ? "order" : "orders"} in view</p>
      {orders.length > 0 && <ReportTable label="Owner order register">
        <thead><tr><th scope="col">Order / items</th><th scope="col">Date</th><th scope="col">Customer / city</th><th scope="col">Channel / source</th><th scope="col">Fulfilment</th><th scope="col">Payment</th><th scope="col">Net sales</th></tr></thead>
        <tbody>{orders.slice(0, orderLimit).map(order => {
          const receipt = receipts.find(item => item.id === order.id);
          return <tr key={order.id}><th scope="row"><details className="report-order"><summary>{order.id}</summary>
          <ul>{order.items.map((item, index) => <li key={item.sku + index}>{products.find(product => product.sku === item.sku)?.title ?? item.sku} · {item.size} / {item.colour} · Qty {item.units}</li>)}</ul>
          {receipt && <OrderActions receipt={receipt} />}</details>
        </th><td>{receiptDate(new Date(order.at).toISOString())}</td><td>{order.customer}<small>{order.city}</small></td><td>{order.channel}<small>{order.source}</small></td>
          <td><span className="report-badge">{order.fulfilment}</span></td><td><span className="report-badge">{order.payment}</span></td><td>{money(netTotal(order))}</td></tr>;
        })}</tbody>
      </ReportTable>}
      {orders.length > orderLimit && <button className="button button-outline load-more" type="button" onClick={() => setOrderLimit(limit => limit + 12)}>Show more orders <ArrowRight size={16} /></button>}
    </section>
    <OwnerEnquiries />
  </>;
}
