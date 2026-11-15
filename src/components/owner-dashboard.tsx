"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Activity, ArrowRight, Download, PackageSearch, ShoppingBag, TrendingUp } from "lucide-react";
import { categories, categoryName, products } from "@/data/catalogue";
import { demoAccounts, useDemoAuth } from "@/lib/demo-auth";
import { receiptDate, useDemoOrders } from "@/lib/demo-orders";
import { money } from "@/lib/commerce";
import { netTotal, orderStatuses, ownerReport, reportCsv, reportPeriods, seedOwnerReport } from "@/lib/owner-report";
import { DemoSignIn } from "./demo-sign-in";

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

function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [now] = useState(Date.now);
  const [data] = useState(() => seedOwnerReport(now));
  const [period, setPeriod] = useState<(typeof reportPeriods)[number]>(30);
  const [category, setCategory] = useState("");
  const [rank, setRank] = useState<DemandKey>("units");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [orderLimit, setOrderLimit] = useState(8);
  const receipts = useDemoOrders(state => state.receipts);
  const report = ownerReport(data, receipts, now, period, category);
  const demand = [...report.demand].sort((a, b) => b[rank] - a[rank] || b.units - a.units);
  const leadingStyle = [...report.demand].sort((a, b) => b.units - a.units)[0];
  const enquiryStyle = [...report.demand].sort((a, b) => b.enquiries - a.enquiries)[0];
  const orders = report.orders.filter(order => (!status || order.status === status) && (!source || order.source === source));
  const maxBar = Math.max(1, ...report.trend.map(point => point.value));
  const stockouts = report.lowStock.filter(item => item.variant.stock === 0);
  const awaiting = report.orders.filter(order => order.status === "Processing" || order.status === "Ready for pickup");
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
      <a href="#inventory"><PackageSearch size={16} /> Stock &amp; enquiries</a><a href="#orders"><ShoppingBag size={16} /> Orders</a>
    </nav>
    <p className="notice">Seeded sales, costs and product traffic are illustrative. {browserCount ? browserCount + " simulated order" + (browserCount === 1 ? "" : "s") + " from this browser included in this view." : "Completed demo orders from this browser appear here when they match the filters."}</p>
    <div className="owner-filters">
      <label>Period<select value={period} onChange={event => { setPeriod(Number(event.target.value) as typeof period); setOrderLimit(8); }}>
        {reportPeriods.map(days => <option key={days} value={days}>Last {days} days</option>)}
      </select></label>
      <label>Collection category<select value={category} onChange={event => { setCategory(event.target.value); setOrderLimit(8); }}>
        <option value="">All categories</option>{categories.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}
      </select></label>
    </div>

    <section id="sales" className="report-section">
      <div className="report-title"><h2>Sales overview</h2><p className="fine">Net sales exclude refunded and cancelled orders.</p></div>
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
      <div className="report-columns operations-columns">
        <section className="report-panel"><h3>Low or out of stock</h3>
          <p className="fine">{stockouts.length} sizes out of stock · {report.lowStock.length - stockouts.length} sizes with one left</p>
          <ReportTable label="Low stock variants"><thead><tr><th scope="col">Style</th><th scope="col">Size</th><th scope="col">On hand</th></tr></thead>
            <tbody>{report.lowStock.map(({ product, variant }) => <tr key={variant.id}><th scope="row">{product.title}<small>{variant.id}</small></th><td>{variant.size}</td><td>
              <span className="report-badge" data-alert={variant.stock === 0}>{variant.stock === 0 ? "Out of stock" : "1 left"}</span></td></tr>)}</tbody>
          </ReportTable>
          {!report.lowStock.length && <p className="fine">No low-stock variants in this view.</p>}
        </section>
        <section className="report-panel"><h3>Order follow-up</h3>
          <ul className="follow-ups">{awaiting.slice(0, 6).map(order => <li key={order.id}><strong>{order.id}</strong><span>{order.status} · {order.channel}</span></li>)}</ul>
          {!awaiting.length && <p className="fine">No processing orders or pickups in this view.</p>}
          <h3>Bespoke enquiries</h3>
          <ul className="follow-ups">{[...report.demand].filter(item => item.enquiries > 0).sort((a, b) => b.enquiries - a.enquiries).slice(0, 4).map(item =>
            <li key={item.product.sku}><strong>{item.product.title}</strong><span>{item.enquiries} sample enquiries</span></li>)}</ul>
        </section>
      </div>
    </section>

    <section id="orders" className="report-section">
      <div className="report-title"><div><h2>Order register</h2><p className="fine">Search by status and source, inspect order lines or export this view.</p></div>
        <button className="button button-outline" type="button" disabled={!orders.length} onClick={download}><Download size={17} /> Export CSV</button></div>
      <div className="owner-filters">
        <label>Order status<select value={status} onChange={event => { setStatus(event.target.value); setOrderLimit(8); }}>
          <option value="">All statuses</option>{orderStatuses.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Order source<select value={source} onChange={event => { setSource(event.target.value); setOrderLimit(8); }}>
          <option value="">All sources</option><option>Seeded</option><option>This browser</option></select></label>
      </div>
      <p className="fine" role="status">{orders.length} {orders.length === 1 ? "order" : "orders"} in view</p>
      {orders.length > 0 && <ReportTable label="Owner order register">
        <thead><tr><th scope="col">Order / items</th><th scope="col">Date</th><th scope="col">Customer / city</th><th scope="col">Channel / source</th><th scope="col">Status</th><th scope="col">Net sales</th></tr></thead>
        <tbody>{orders.slice(0, orderLimit).map(order => <tr key={order.id}><th scope="row"><details className="report-order"><summary>{order.id}</summary>
          <ul>{order.items.map((item, index) => <li key={item.sku + index}>{products.find(product => product.sku === item.sku)?.title ?? item.sku} · {item.size} · Qty {item.units}</li>)}</ul></details>
        </th><td>{receiptDate(new Date(order.at).toISOString())}</td><td>{order.customer}<small>{order.city}</small></td><td>{order.channel}<small>{order.source}</small></td>
          <td><span className="report-badge">{order.status}</span></td><td>{money(netTotal(order))}</td></tr>)}</tbody>
      </ReportTable>}
      {orders.length > orderLimit && <button className="button button-outline load-more" type="button" onClick={() => setOrderLimit(limit => limit + 12)}>Show more orders <ArrowRight size={16} /></button>}
    </section>
  </>;
}
