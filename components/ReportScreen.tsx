import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { type ReportData, type RawScores, type UserData } from '../types';
import { getNormalizedScoresForChart } from '../utils/scoreCalculator';
import { ScoreChart } from './ScoreChart';
import { LightbulbIcon, BriefcaseIcon, GrowthIcon, DownloadIcon, RefreshCwIcon, StarIcon, TargetIcon, BookOpenIcon, ZapIcon, CodeIcon, DollarSignIcon, PaletteIcon, StethoscopeIcon, UsersIcon, UserIcon, CompassIcon, FlagIcon, MicIcon, HelpCircleIcon } from './icons';

interface ReportScreenProps {
  report: ReportData;
  scores: RawScores;
  userData: UserData;
  onRetake: () => void;
}

const SectionCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode, className?: string }> = ({ icon, title, children, className = '' }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 h-full ${className}`}>
        <div className="flex items-center mb-4">
            {icon}
            <h3 className="text-xl font-bold text-slate-800 ml-3">{title}</h3>
        </div>
        <div className="text-slate-600">
            {children}
        </div>
    </div>
);

const RecommendationIcon: React.FC<{type: 'Habit' | 'Resource' | 'Exercise'}> = ({type}) => {
    switch (type) {
        case 'Habit': return <StarIcon className="h-6 w-6 text-yellow-500 mr-4 flex-shrink-0"/>;
        case 'Resource': return <BookOpenIcon className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0"/>;
        case 'Exercise': return <ZapIcon className="h-6 w-6 text-green-500 mr-4 flex-shrink-0"/>;
        default: return null;
    }
}

const CareerIcon: React.FC<{title: string}> = ({title}) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('develop') || lowerTitle.includes('software') || lowerTitle.includes('engine') || lowerTitle.includes('tech')) {
        return <CodeIcon className="h-8 w-8 text-white"/>;
    }
    if (lowerTitle.includes('business') || lowerTitle.includes('financ') || lowerTitle.includes('analy') || lowerTitle.includes('manager')) {
        return <DollarSignIcon className="h-8 w-8 text-white"/>;
    }
    if (lowerTitle.includes('design') || lowerTitle.includes('art') || lowerTitle.includes('media')) {
        return <PaletteIcon className="h-8 w-8 text-white"/>;
    }
     if (lowerTitle.includes('health') || lowerTitle.includes('doctor') || lowerTitle.includes('therapist') || lowerTitle.includes('medic')) {
        return <StethoscopeIcon className="h-8 w-8 text-white"/>;
    }
    if (lowerTitle.includes('social') || lowerTitle.includes('counsel') || lowerTitle.includes('teacher')) {
        return <UsersIcon className="h-8 w-8 text-white"/>;
    }
    return <BriefcaseIcon className="h-8 w-8 text-white"/>;
}

const capitalize = (s: string) => {
    if (!s) return '';
    // Handle camelCase like 'orientationStyle' -> 'Orientation Style'
    return s.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
}

const ScoreBreakdownBar: React.FC<{label: string, score: number, maxScore: number, colorClass: string}> = ({label, score, maxScore, colorClass}) => {
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="font-medium text-slate-500">{score} / {maxScore}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
                <div className={`${colorClass} h-2 rounded-full`} style={{width: `${percentage}%`}}></div>
            </div>
        </div>
    );
};

const DetailedScores: React.FC<{scores: RawScores, analysis: ReportData['detailedAnalyses']}> = ({scores, analysis}) => {
    const categories: {name: keyof RawScores, title: string, color: string, max: number}[] = [
        {name: 'orientationStyle', title: 'Orientation Style', color: 'bg-cyan-500', max: 10},
        {name: 'interest', title: 'Interest', color: 'bg-amber-500', max: 25},
        {name: 'personality', title: 'Personality', color: 'bg-violet-500', max: 5},
        {name: 'aptitude', title: 'Aptitude', color: 'bg-rose-500', max: 5},
        {name: 'eq', title: 'Emotional Quotient (EQ)', color: 'bg-lime-500', max: 5},
    ];

    return (
        <div className="space-y-6">
            {categories.map(cat => (
                 <div key={cat.name} className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/90">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">{cat.title}</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                        {Object.entries(scores[cat.name]).map(([subCat, score]) => (
                             <ScoreBreakdownBar key={subCat} label={capitalize(subCat)} score={score as number} maxScore={cat.max} colorClass={cat.color} />
                        ))}
                    </div>
                    <p className="text-sm text-slate-700 bg-slate-200/70 p-3 rounded-lg">{analysis[cat.name]}</p>
                 </div>
            ))}
        </div>
    );
};

export const ReportScreen: React.FC<ReportScreenProps> = ({ report, scores, userData, onRetake }) => {
  const reportContentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const normalizedScores = getNormalizedScoresForChart(scores);

  const downloadPdf = async () => {
    const contentToCapture = reportContentRef.current;
    if (!contentToCapture) {
      console.error("Report content element not found.");
      alert("Unable to generate PDF. Please refresh the page and try again.");
      return;
    }
  
    setIsDownloading(true);
    const elementsToHide = document.querySelectorAll<HTMLElement>('.pdf-hide');
    elementsToHide.forEach(el => { el.style.display = 'none'; });
  
    try {
      // Add a small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(contentToCapture, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        height: contentToCapture.scrollHeight,
        width: contentToCapture.scrollWidth,
      });
  
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // margins + header/footer
      const margin = 10;
      const headerHeight = 20;
      const footerHeight = 10;
      const contentWidth = pdfWidth - (2 * margin);
      const contentHeight = pdfHeight - headerHeight - footerHeight - margin;
  
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = contentWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  
      let yPosition = 0;
      let pageNumber = 1;
      const totalPages = Math.ceil(imgHeight / contentHeight) + 1; // +1 cover
  
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
  
      // --- Modern Cover Page ---
      pdf.setFillColor('#ffffff');
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
  
      // 🔹 Border with rounded corners
      pdf.setDrawColor('#d1d5db'); // light gray
      pdf.setLineWidth(0.8);
      pdf.roundedRect(12, 12, pdfWidth - 24, pdfHeight - 24, 8, 8);
  
      // 🔹 Logo - using the same logo from header
      try {
        const logoUrl = 'https://i.postimg.cc/c4j4nLFd/Removal-40.png';
        const logoWidth = 45;
        const logoHeight = 45;
        const logoX = (pdfWidth - logoWidth) / 2;
        const logoY = 50;
        pdf.addImage(logoUrl, 'PNG', logoX, logoY, logoWidth, logoHeight);
      } catch (logoError) {
        console.warn('Logo could not be added to PDF:', logoError);
        // Continue without logo if it fails
      }
  
      // Title
      pdf.setFontSize(26).setTextColor('#1e293b').setFont('helvetica', 'bold');
      pdf.text('Career Assessment Report', pdfWidth / 2, 115, { align: 'center' });
  
      // Accent underline
      pdf.setDrawColor('#3b82f6');
      pdf.setLineWidth(1.2);
      pdf.line(pdfWidth / 2 - 40, 120, pdfWidth / 2 + 40, 120);
  
      // Branding
      pdf.setFontSize(16).setTextColor('#3b82f6').setFont('helvetica', 'bold');
      pdf.text('FindWay.ai', pdfWidth / 2, 140, { align: 'center' });
  
      // User Info
      pdf.setFontSize(13).setTextColor('#374151').setFont('helvetica', 'normal');
      pdf.text(`Prepared for: ${userData.name}`, pdfWidth / 2, 165, { align: 'center' });
  
      pdf.setFontSize(11).setTextColor('#6b7280');
      pdf.text(`Generated on ${currentDate}`, pdfWidth / 2, 180, { align: 'center' });
  
      // Footer
      pdf.setFontSize(10).setTextColor('#9ca3af');
      pdf.text('Confidential Career Assessment Report', pdfWidth / 2, pdfHeight - 30, { align: 'center' });
      pdf.text('www.findway.ai', pdfWidth / 2, pdfHeight - 20, { align: 'center' });
  
      pdf.addPage();
      pageNumber++;
  
      // --- Header/Footer helper ---
      const addPageTemplate = (pageNum: number, totalPages: number) => {
        // header
        pdf.setFontSize(13).setTextColor('#1e293b').setFont('helvetica', 'bold');
        pdf.text(`Career Assessment Report`, margin, 18);
  
        pdf.setFontSize(14).setTextColor('#3b82f6').setFont('helvetica', 'bold');
        const findwayText = 'FindWay.ai';
        pdf.text(findwayText, pdfWidth - margin - pdf.getTextWidth(findwayText), 18);
  
        pdf.setFontSize(10).setTextColor('#64748b').setFont('helvetica', 'normal');
        pdf.text(`For: ${userData.name}`, margin, 27);
        const dateStr = `Generated: ${currentDate}`;
        pdf.text(dateStr, pdfWidth - margin - pdf.getTextWidth(dateStr), 27);
  
        // footer
        pdf.setFontSize(9).setTextColor('#94a3b8');
        pdf.text('Confidential Career Assessment Report', margin, pdfHeight - 8);
  
        const pageText = `Page ${pageNum} of ${totalPages}`;
        pdf.text(pageText, pdfWidth - margin - pdf.getTextWidth(pageText), pdfHeight - 8);
  
        const websiteText = 'www.findway.ai';
        pdf.text(websiteText, (pdfWidth - pdf.getTextWidth(websiteText)) / 2, pdfHeight - 8);
      };
  
      // --- Slice content into pages ---
      while (yPosition < imgHeight) {
        const canvasPage = document.createElement('canvas');
        const ctx = canvasPage.getContext('2d')!;
        const sliceHeight = Math.min(contentHeight, imgHeight - yPosition);
  
        canvasPage.width = imgProps.width;
        canvasPage.height = (sliceHeight * imgProps.width) / contentWidth;
  
        ctx.drawImage(
          canvas,
          0, (yPosition * imgProps.width) / contentWidth, imgProps.width, (sliceHeight * imgProps.width) / contentWidth,
          0, 0, canvasPage.width, canvasPage.height
        );
  
        const pageImgData = canvasPage.toDataURL('image/png');
  
        if (pageNumber > 2) pdf.addPage();
        addPageTemplate(pageNumber - 1, totalPages);
  
        const topOffset = headerHeight + 8;
        const usableHeight = pdfHeight - topOffset - footerHeight - 5;
        pdf.addImage(pageImgData, 'PNG', margin, topOffset, imgWidth, usableHeight);
  
        yPosition += contentHeight;
        pageNumber++;
      }
  
      // Generate safe filename
      const safeUserName = userData.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
      const filename = `FindWay_Career_Report_${safeUserName}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdf.save(filename);
      
      // Success notification
      console.log('PDF generated successfully:', filename);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      
      // More specific error handling
      let errorMessage = "Sorry, there was an error generating the PDF. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('canvas')) {
          errorMessage = "Unable to capture report content. Please scroll to the top and try again.";
        } else if (error.message.includes('network') || error.message.includes('CORS')) {
          errorMessage = "Network error while generating PDF. Please check your connection and try again.";
        }
      }
      
      alert(errorMessage);
    } finally {
      // Restore hidden elements
      elementsToHide.forEach(el => { 
        if (el.style.display === 'none') {
          el.style.display = ''; 
        }
      });
      setIsDownloading(false);
    }
  };  



  return (
    <div className="bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm pdf-hide">
        <div className="container mx-auto px-4 py-3">
            {/* Mobile Layout */}
            <div className="md:hidden">
                {/* Buttons First */}
                <div className="flex gap-3 justify-center mb-6">
                    <button onClick={onRetake} className="flex items-center px-4 py-2.5 bg-white text-slate-700 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors font-semibold text-sm shadow-sm">
                        <RefreshCwIcon className="h-4 w-4 mr-2" /> Retake
                    </button>
                    <button onClick={downloadPdf} disabled={isDownloading} className="flex items-center px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-400 disabled:cursor-wait text-sm">
                        {isDownloading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <DownloadIcon className="h-4 w-4 mr-2" /> PDF
                            </>
                        )}
                    </button>
                </div>
                {/* Heading Below */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <CompassIcon className="h-6 w-6 text-indigo-600" />
                        <h1 className="text-lg font-bold text-slate-800">Your Career Report</h1>
                    </div>
                    <p className="text-sm text-slate-500">For {userData.name}</p>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <CompassIcon className="h-8 w-8 text-indigo-600" />
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Your Career Report</h1>
                        <p className="text-sm text-slate-500">For {userData.name}</p>
                    </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                    <button onClick={onRetake} className="flex items-center px-4 py-2 bg-white text-slate-700 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors font-semibold">
                        <RefreshCwIcon className="h-4 w-4 mr-2" /> Retake Test
                    </button>
                    <button onClick={downloadPdf} disabled={isDownloading} className="flex items-center px-5 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-indigo-400 disabled:cursor-wait">
                        {isDownloading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <DownloadIcon className="h-5 w-5 mr-2" /> Download PDF
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div ref={reportContentRef}>
            <div className="space-y-8">
            
            <div className="p-8 bg-slate-50 rounded-2xl print:p-6 print:shadow-none print:bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SectionCard icon={<UserIcon className="h-8 w-8 text-indigo-500" />} title="AI Profile Summary">
                        <p className="leading-relaxed">{report.profileSummary}</p>
                    </SectionCard>
                    <SectionCard icon={<CompassIcon className="h-8 w-8 text-indigo-500" />} title="Your Profile Overview">
                        <ScoreChart scores={normalizedScores} />
                    </SectionCard>
                </div>
                <div className="mt-8">
                    <SectionCard icon={<BriefcaseIcon className="h-8 w-8 text-indigo-500" />} title="Top 3 Career Matches">
                        <div className="space-y-6 mt-2">
                            {report.careerMatches?.map((match, index) => (
                                <div key={index} className="bg-slate-100 p-5 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-5 items-start">
                                    <div className="flex-shrink-0 bg-indigo-500 rounded-xl h-16 w-16 flex items-center justify-center">
                                        <CareerIcon title={match.title} />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                            <h4 className="font-bold text-lg text-indigo-900">{match.title}</h4>
                                            <div className="text-sm font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full self-start mt-2 sm:mt-0">
                                                {match.compatibility}% Match
                                            </div>
                                        </div>
                                        <p className="text-slate-700 mt-2 mb-4 text-sm leading-6">{match.description}</p>
                                        <div className="text-xs space-y-2 bg-white/80 p-3 rounded-lg border border-slate-200/80">
                                            <p><strong className="font-semibold text-slate-600">Trends:</strong> {match.trends}</p>
                                            <p><strong className="font-semibold text-slate-600">Education:</strong> {match.education}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            </div>
            
            <div className="p-8 bg-slate-50 rounded-2xl print:p-6 print:shadow-none print:bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <SectionCard icon={<LightbulbIcon className="h-8 w-8 text-yellow-500" />} title="Dominant Strengths">
                        <ul className="space-y-4">
                            {report.strengths?.map((strength, index) => (
                                <li key={index} className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                                    <p className="font-bold text-yellow-900">{strength.title}</p>
                                    <p className="text-sm text-slate-700 mt-1">{strength.description}</p>
                                </li>
                            ))}
                        </ul>
                    </SectionCard>
                    <SectionCard icon={<GrowthIcon className="h-8 w-8 text-green-500" />} title="Development Plan">
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-md text-slate-700 flex items-center mb-3"><TargetIcon className="h-5 w-5 text-red-500 mr-2"/>Areas for Improvement</h4>
                                <ul className="space-y-3">
                                    {report.developmentPlan?.areasForImprovement?.map((area, index) => (
                                        <li key={index} className="bg-red-50 p-3 rounded-lg">
                                            <p className="font-bold text-red-900 text-sm">{area.title}</p>
                                            <p className="text-xs text-slate-600">{area.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-md text-slate-700 mb-3">Actionable Recommendations</h4>
                                <ul className="space-y-3">
                                    {report.developmentPlan?.recommendations?.map((rec, index) => (
                                        <li key={index} className="flex items-start bg-green-50 p-3 rounded-lg">
                                            <RecommendationIcon type={rec.type} />
                                            <div>
                                                <p className="font-bold text-green-900 text-sm">{rec.type}</p>
                                                <p className="text-xs text-slate-600">{rec.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </SectionCard>
                </div>
                <SectionCard icon={<TargetIcon className="h-8 w-8 text-blue-500" />} title="In-Depth Analysis">
                    <DetailedScores scores={scores} analysis={report.detailedAnalyses} />
                </SectionCard>
            </div>
            
            {report.interviewPrep && (
                <div className="p-8 bg-slate-50 rounded-2xl print:p-6 print:shadow-none print:bg-white">
                    <SectionCard icon={<MicIcon className="h-8 w-8 text-teal-500" />} title="Interview Preparation Tips">
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-md text-slate-700 mb-3">General Tips</h4>
                                <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                                    {report.interviewPrep.generalTips.map((tip, index) => (
                                        <li key={index}>{tip}</li>
                                    ))}
                                </ul>
                            </div>

                            {report.interviewPrep.careerSpecificTips.map((careerTips, index) => (
                                <div key={index}>
                                    <h4 className="font-semibold text-md text-slate-700 mb-3 pt-4 border-t border-slate-200">
                                        For a <span className="text-indigo-600 font-bold">{careerTips.careerTitle}</span> Role
                                    </h4>
                                    <div className="space-y-4">
                                        {careerTips.sampleQuestions.map((q, qIndex) => (
                                            <div key={qIndex} className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                                                <p className="font-bold text-slate-800 text-sm flex items-start">
                                                    <HelpCircleIcon className="h-5 w-5 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                                                    {q.question}
                                                </p>
                                                <p className="text-xs text-slate-600 mt-2 pl-7">{q.answerGuidance}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                </div>
            )}

            <div className="p-8 bg-slate-50 rounded-2xl print:p-6 print:shadow-none print:bg-white">
                <SectionCard icon={<FlagIcon className="h-8 w-8 text-indigo-500" />} title="Your Journey Forward">
                    <p className="leading-relaxed text-lg">{report.concludingRemarks}</p>
                </SectionCard>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};
