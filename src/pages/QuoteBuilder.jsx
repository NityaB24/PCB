import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FabricationForm from "../components/Forms/Fabrication";
import AssemblyForm from "../components/Forms/Assembly";
import ProcurementForm from "../components/Forms/Procurement";
import QuoteFormSection from "../components/Forms/Quote";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../components/ui/drawer";


const serviceInfo = {
  fabrication: {
    label: "PCB Fabrication",
    desc: "Custom PCB boards manufactured to your exact specifications",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="3" />
        <circle cx="8" cy="8" r="1.5" />
        <circle cx="16" cy="8" r="1.5" />
        <circle cx="8" cy="16" r="1.5" />
        <circle cx="16" cy="16" r="1.5" />
        <path d="M8 9.5v5M9.5 8h5" />
      </svg>
    ),
  },
  assembly: {
    label: "PCB Assembly",
    desc: "Component mounting and soldering by our expert team",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  procurement: {
    label: "Procurement",
    desc: "Source components and materials through our supply chain",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
};

const initialFab = {
  gerberFile: null,
  layers: "2",
  quantity: "",
  width: "",
  height: "",
  discreteDesign: "1",
  boardType: "Single PCB",
  thickness: "1.6mm",
  copperThickness: "1 oz",
  pcbFinish: "HASL Finish",
  maskColor: "Green",
};

const initialAssembly = {
  bomFile: null,
  units: "",
  stencil: "Procure from us",
  solderType: "ROHS",
  componentsSource: "Provided by user",
  pcbSource: "Provided by user",
};

const initialProcurement = {
  componentFile: null,
  components: [{ partNumber: "", description: "", manufacturers: "" }],
};

const initialQuote = {
  name: "",
  email: "",
  phone: "",
  companyName: "",
  purpose: "",
  comments: "",
};

const steps = [
  { key: "select", label: "Select Service" },
  { key: "configure", label: "Configure" },
  { key: "review", label: "Review & Submit" },
];

const QuoteBuilder = () => {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [activeConfigTab, setActiveConfigTab] = useState("fabrication");
  const [fabData, setFabData] = useState(initialFab);
  const [assemblyData, setAssemblyData] = useState(initialAssembly);
  const [procurementData, setProcurementData] = useState(initialProcurement);
  const [quoteData, setQuoteData] = useState(initialQuote);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Derive which tabs are visible based on selected service + assembly choices
  const enabledTabs = useMemo(() => {
    if (!selectedService) return [];
    if (selectedService !== "assembly") return [selectedService];

    const tabs = ["assembly"];
    if (assemblyData.pcbSource === "Fabricate from us") {
      tabs.push("fabrication");
    }
    if (assemblyData.componentsSource === "Procure from us") {
      tabs.push("procurement");
    }
    return tabs;
  }, [selectedService, assemblyData.pcbSource, assemblyData.componentsSource]);

  // Keep activeConfigTab in sync
  useEffect(() => {
    if (enabledTabs.length > 0 && !enabledTabs.includes(activeConfigTab)) {
      setActiveConfigTab(enabledTabs[0]);
    }
  }, [enabledTabs, activeConfigTab]);

  const selectService = (key) => {
    setSelectedService((prev) => (prev === key ? null : key));
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!quoteData.name.trim()) errs.name = "Name is required";
    if (!quoteData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteData.email)) errs.email = "Invalid email";
    if (!quoteData.phone.trim()) errs.phone = "Phone is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = { contact: quoteData, services: {} };
    if (enabledTabs.includes("fabrication")) {
      (payload.services).fabrication = { ...fabData, gerberFile: fabData.gerberFile?.name || null };
    }
    if (enabledTabs.includes("assembly")) {
      (payload.services).assembly = { ...assemblyData, bomFile: assemblyData.bomFile?.name || null };
    }
    if (enabledTabs.includes("procurement") || selectedService === "procurement") {
      (payload.services).procurement = {
        componentFile: procurementData.componentFile?.name || null,
        components: procurementData.components,
      };
    }
    console.log("📋 Quote Request Submitted:", payload);
    setDrawerOpen(false);
    setSubmitted(true);
  };

  const openContactDrawer = () => {
    setErrors({});
    setDrawerOpen(true);
  };

  const goNext = () => {
    if (step === 0 && !selectedService) {
      setErrors({ services: "Please select a service to continue" });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 2));
    if (step === 0 && enabledTabs.length > 0) {
      setActiveConfigTab(enabledTabs[0]);
    }
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md px-4"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Quote Request Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you, {quoteData.name}. We'll review your requirements and get back to you at{" "}
              <span className="text-primary font-mono text-sm">{quoteData.email}</span> with a detailed quotation.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(0);
                setSelectedService(null);
                setFabData(initialFab);
                setAssemblyData(initialAssembly);
                setProcurementData(initialProcurement);
                setQuoteData(initialQuote);
                setErrors({});
              }}
              className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
            >
              Submit Another Quote
            </button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // Summary for drawer
  const summaryItems = [];
  if (enabledTabs.includes("fabrication")) {
    summaryItems.push({
      label: "PCB Fabrication",
      details: [
        `${fabData.layers} Layer${fabData.layers !== "1" ? "s" : ""}`,
        fabData.quantity ? `Qty: ${fabData.quantity}` : "",
        fabData.width && fabData.height ? `${fabData.width}×${fabData.height}mm` : "",
        fabData.boardType,
        fabData.thickness,
        fabData.copperThickness,
        fabData.pcbFinish,
        `${fabData.maskColor} mask`,
        fabData.gerberFile ? `📎 ${fabData.gerberFile.name}` : "",
      ].filter(Boolean),
    });
  }
  if (enabledTabs.includes("assembly")) {
    summaryItems.push({
      label: "PCB Assembly",
      details: [
        assemblyData.units ? `${assemblyData.units} units` : "",
        `Stencil: ${assemblyData.stencil}`,
        `Solder: ${assemblyData.solderType}`,
        `Components: ${assemblyData.componentsSource}`,
        `PCB: ${assemblyData.pcbSource}`,
        assemblyData.bomFile ? `📎 ${assemblyData.bomFile.name}` : "",
      ].filter(Boolean),
    });
  }
  if (enabledTabs.includes("procurement") || selectedService === "procurement") {
    const filledRows = procurementData.components.filter(
      (row) => row.partNumber.trim() || row.description.trim() || row.manufacturers.trim()
    );
    summaryItems.push({
      label: "Component Procurement",
      details: [
        procurementData.componentFile ? `📎 ${procurementData.componentFile.name}` : "No file uploaded",
        `${filledRows.length} component row${filledRows.length !== 1 ? "s" : ""} added`,
      ],
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8 sm:py-10">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Build Your <span className="text-primary">Quote</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Follow the steps below to configure your PCB requirements.
              </p>
            </motion.div>

            {/* Stepper */}
            <div className="mb-8">
              <div className="flex items-center gap-0">
                {steps.map((s, i) => {
                  const isActive = i === step;
                  const isComplete = i < step;
                  return (
                    <div key={s.key} className="flex items-center flex-1 last:flex-initial">
                      <button
                        type="button"
                        onClick={() => {
                          if (i < step) setStep(i);
                        }}
                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : isComplete
                            ? "bg-primary/15 text-primary cursor-pointer hover:bg-primary/25"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isActive ? "bg-primary-foreground/20" : isComplete ? "bg-primary/20" : "bg-background/50"
                        }`}>
                          {isComplete ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </span>
                        <span className="hidden sm:inline">{s.label}</span>
                      </button>
                      {i < steps.length - 1 && (
                        <div className="flex-1 mx-2">
                          <div className="h-0.5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className="h-full bg-primary"
                              initial={false}
                              animate={{ width: i < step ? "100%" : "0%" }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {errors.services && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v4M12 16h.01" />
                </svg>
                {errors.services}
              </motion.div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {/* STEP 0: Select Service (single) */}
              {step === 0 && (
                <motion.div
                  key="step-select"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="text-sm text-muted-foreground mb-5">
                    Choose the service you need.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(Object.keys(serviceInfo)).map((key) => {
                      const info = serviceInfo[key];
                      const isOn = selectedService === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => selectService(key)}
                          className={`group relative rounded-xl border-2 p-5 text-left transition-all duration-200 ${
                            isOn
                              ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                              : "border-border bg-card hover:border-muted-foreground/40 hover:shadow-sm"
                          }`}
                        >
                          {/* Radio indicator */}
                          <div className={`absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                            isOn ? "border-primary bg-primary" : "border-muted-foreground/30"
                          }`}>
                            {isOn && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-2 w-2 rounded-full bg-primary-foreground"
                              />
                            )}
                          </div>

                          <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
                            isOn ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground group-hover:text-foreground"
                          }`}>
                            {info.icon}
                          </div>
                          <h3 className="text-sm font-semibold mb-1">{info.label}</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">{info.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 1: Configure */}
              {step === 1 && (
                <motion.div
                  key="step-configure"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Tabs for visible services */}
                  {enabledTabs.length > 1 && (
                    <div className="mx-auto sm:mx-0 flex gap-1 mb-6 p-1 rounded-lg bg-muted/50 border border-border w-fit">
                      {enabledTabs.map((key) => {
                        const info = serviceInfo[key];
                        const isActive = activeConfigTab === key;
                        const isAutoAdded = key !== selectedService;
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setActiveConfigTab(key)}
                            className={`relative flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                              isActive
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className="hidden sm:inline">{info.label}</span>
                            <span className="sm:hidden">{info.label.replace("PCB ", "")}</span>
                            {/* {isAutoAdded && (
                              <span className="ml-1 inline-flex h-4 items-center rounded bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">
                                Auto
                              </span>
                            )} */}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Form area */}
                  <div className="rounded-xl border border-border bg-card">
                    <AnimatePresence mode="wait">
                      {activeConfigTab === "fabrication" && enabledTabs.includes("fabrication") && (
                        <motion.div
                          key="fab"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.2 }}
                          className="p-5 sm:p-6"
                        >
                          <div className="mb-5 pb-4 border-b border-border">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                              <span className="text-primary">{serviceInfo.fabrication.icon}</span>
                              PCB Fabrication
                              {selectedService === "assembly" && (
                                <span className="ml-2 inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  Added via Assembly
                                </span>
                              )}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                              Configure your board specifications below
                            </p>
                          </div>
                          <FabricationForm data={fabData} onChange={setFabData} />
                        </motion.div>
                      )}

                      {activeConfigTab === "assembly" && enabledTabs.includes("assembly") && (
                        <motion.div
                          key="asm"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.2 }}
                          className="p-5 sm:p-6"
                        >
                          <div className="mb-5 pb-4 border-b border-border">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                              <span className="text-primary">{serviceInfo.assembly.icon}</span>
                              PCB Assembly
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                              Configure assembly requirements
                            </p>
                          </div>
                          <AssemblyForm
                            data={assemblyData}
                            onChange={setAssemblyData}
                          />
                        </motion.div>
                      )}

                      {activeConfigTab === "procurement" && enabledTabs.includes("procurement") && (
                        <motion.div
                          key="proc"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 15 }}
                          transition={{ duration: 0.2 }}
                          className="p-5 sm:p-6"
                        >
                          <div className="mb-5 pb-4 border-b border-border">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                              <span className="text-primary">{serviceInfo.procurement.icon}</span>
                              Component Procurement
                              {selectedService === "assembly" && (
                                <span className="ml-2 inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  Added via Assembly
                                </span>
                              )}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-1">
                              Upload your component list or add it manually
                            </p>
                          </div>
                          <ProcurementForm data={procurementData} onChange={setProcurementData} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Review */}
              {step === 2 && (
                <motion.div
                  key="step-review"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                    <div className="mb-5 pb-4 border-b border-border">
                      <h2 className="text-lg font-semibold">Review Your Configuration</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check your selected services and specifications before sending your request.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {summaryItems.map((item, index) => (
                        <div key={item.label} className="rounded-lg border border-border bg-secondary/20 p-4">
                          <div className="mb-3 flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                              {index + 1}
                            </span>
                            <h4 className="text-sm font-semibold text-foreground">{item.label}</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {item.details.map((d, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center rounded-md bg-background px-2.5 py-1.5 text-xs text-foreground/85 border border-border"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <p className="text-sm text-muted-foreground">
                        Next step: click <span className="font-semibold text-foreground">Send Request</span> to provide your contact details in the drawer.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={step === 2 ? openContactDrawer : goNext}
                className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110 glow-primary"
              >
                {step === 1 ? "Review & Submit" : step === 2 ? "Send Request" : "Continue"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {step === 0 && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                No instant pricing — our team will review and provide a detailed quotation via email.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Quote Review Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="h-[88dvh] sm:h-auto sm:max-h-[86vh] overflow-hidden border border-border/60 sm:mx-auto sm:mb-6 sm:w-full sm:max-w-xl sm:rounded-2xl">
          <div className="h-full overflow-y-auto px-4 sm:px-6 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-xl">Share Your Contact Details</DrawerTitle>
              <DrawerDescription>
                Fill in your information below and send your quote request.
              </DrawerDescription>
            </DrawerHeader>

            {/* Contact form */}
            <div>
              <h3 className="text-sm font-semibold mb-1">Contact Details</h3>
              <p className="text-xs text-muted-foreground mb-4">
                We'll send your custom quotation to the email provided.
              </p>
              <QuoteFormSection data={quoteData} onChange={setQuoteData} errors={errors} />
            </div>

            <DrawerFooter className="px-0 pt-5">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
              >
                Submit Quote Request
              </button>
              <DrawerClose asChild>
                <button
                  type="button"
                  className="w-full rounded-lg border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  Go Back & Edit
                </button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default QuoteBuilder;
