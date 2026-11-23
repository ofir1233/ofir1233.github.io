import Foundation
import Vision
import CoreImage
import AppKit

let path = CommandLine.arguments[1]
let outDir = CommandLine.arguments[2]
let url = URL(fileURLWithPath: path)
let ci = CIImage(contentsOf: url)!
let handler = VNImageRequestHandler(ciImage: ci, options: [:])
let ctx = CIContext()
func save(_ pb: CVPixelBuffer, _ name: String) {
    let im = CIImage(cvPixelBuffer: pb)
    let cs = CGColorSpace(name: CGColorSpace.linearGray)!
    let u = URL(fileURLWithPath: outDir + "/" + name)
    try! ctx.writePNGRepresentation(of: im, to: u, format: .L8, colorSpace: cs)
}
if #available(macOS 14.0, *) {
    let req = VNGenerateForegroundInstanceMaskRequest()
    try handler.perform([req])
    if let obs = req.results?.first {
        print("instances:", obs.allInstances.count)
        for i in obs.allInstances {
            let pb = try obs.generateScaledMaskForImage(forInstances: IndexSet(integer: i), from: handler)
            save(pb, "fg-inst-\(i).png")
        }
    } else { print("no fg result") }
}
let p = VNGeneratePersonSegmentationRequest()
p.qualityLevel = .accurate
p.outputPixelFormat = kCVPixelFormatType_OneComponent8
try handler.perform([p])
if let r = p.results?.first { save(r.pixelBuffer, "person.png") }
if #available(macOS 14.0, *) {
    let pi = VNGeneratePersonInstanceMaskRequest()
    try handler.perform([pi])
    if let obs = pi.results?.first {
        print("person instances:", obs.allInstances.count)
        for i in obs.allInstances {
            let pb = try obs.generateScaledMaskForImage(forInstances: IndexSet(integer: i), from: handler)
            save(pb, "pinst-\(i).png")
        }
    }
}
