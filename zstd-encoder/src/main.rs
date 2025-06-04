use std::fs::{self, File};
use std::io::{self, BufReader, BufWriter, Write};
use std::path::Path;
use zstd::stream::write::Encoder;
use serde::{Serialize, Deserialize};
use serde_json;

#[derive(Debug, Serialize, Deserialize)]
struct FileEntry {
    path: String,
    size: u64,
}

fn main() -> io::Result<()> {
    let input_dir = Path::new("assets");
    let output_file = "assets.zst";

    if !input_dir.exists() {
        return Err(io::Error::new(
            io::ErrorKind::NotFound,
            "assets directory not found",
        ));
    }

    let file_out = File::create(output_file)?;
    let writer = BufWriter::new(file_out);
    let mut enc = Encoder::new(writer, 22)?;

    let mut files = Vec::new();
    fn collect_files(dir: &Path, base_path: &Path, files: &mut Vec<FileEntry>) -> io::Result<()> {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let path = entry.path();
            
            if path.is_file() {
                let relative_path = path.strip_prefix(base_path).unwrap();
                let size = fs::metadata(&path)?.len();
                files.push(FileEntry {
                    path: relative_path.to_string_lossy().to_string(),
                    size,
                });
            } else if path.is_dir() {
                collect_files(&path, base_path, files)?;
            }
        }
        Ok(())
    }

    collect_files(input_dir, input_dir, &mut files)?;
    let total_files = files.len();

    let file_list = serde_json::to_string(&files)?;
    enc.write_all(file_list.as_bytes())?;
    enc.write_all(b"\n")?;

    let mut processed_files = 0;
    
    for file in &files {
        let file_path = input_dir.join(&file.path);
        let mut input = BufReader::new(File::open(&file_path)?);
        
        io::copy(&mut input, &mut enc)?;
        
        processed_files += 1;
        print!("\r{}/{}", processed_files, total_files);
        io::stdout().flush()?;
    }
    println!();

    let mut w = enc.finish()?;
    w.flush()?;

    println!("Done and done!");
    Ok(())
}
